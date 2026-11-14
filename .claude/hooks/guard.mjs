#!/usr/bin/env node
// PreToolUse 훅. 모델 판단과 무관하게 차단해야 하는 규칙만 둔다.
// 설명으로 타이르면 되는 것은 여기가 아니라 .claude/rules/ 에 쓴다.

import { readFileSync } from 'node:fs';

const read = () => {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return null;
  }
};

const deny = (reason) => {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
};

const payload = read();
if (!payload) process.exit(0);

const tool = payload.tool_name ?? '';
const input = payload.tool_input ?? {};
const path = String(input.file_path ?? '').replace(/\\/g, '/');

if (!['Write', 'Edit', 'NotebookEdit'].includes(tool)) process.exit(0);

const written = [input.content, input.new_string]
  .filter((v) => typeof v === 'string')
  .join('\n');

// 1. 비밀값 파일은 편집하지 않는다.
if (/(^|\/)\.env(\.|$)/.test(path)) {
  deny('.env 는 직접 편집하지 않는다. 값이 필요하면 사용자에게 요청한다.');
}

// 2. 촬영물이 기기 갤러리에 저장되는 입력을 막는다.
//    공용 기기의 갤러리가 오염되면 사전 준비한 가게 사진을 관람객이 찾지 못한다.
//    getUserMedia 로 앱 안에서 촬영한다. (.claude/rules/media-capture.md)
if (/\bcapture\s*=\s*["'{]/.test(written)) {
  deny(
    'file input 에 capture 속성을 쓰지 않는다. 기기 카메라 앱으로 촬영하면 공용 기기 갤러리에 촬영물이 쌓인다. getUserMedia 를 쓴다.',
  );
}

// 3. 전시 기기 성능을 깎는 의존성을 막는다.
if (/(^|\/)package\.json$/.test(path)) {
  const heavy = ['three', '@react-three/', 'shadergradient', 'liquid-glass'];
  const hit = heavy.find((name) => written.includes(`"${name}`) || written.includes(name + '"'));
  if (hit) {
    deny(
      `${hit} 는 추가하지 않는다. 촬영과 녹화가 도는 기기에서 GPU 를 함께 쓰면 프레임이 떨어지거나 녹화가 끊긴다.`,
    );
  }
}

process.exit(0);
