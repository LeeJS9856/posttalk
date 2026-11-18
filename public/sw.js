/*
 * 설치형 웹앱을 위한 최소 서비스 워커.
 *
 * 하는 일은 둘뿐이다.
 *  1. 설치 조건을 채운다. 크롬은 fetch 를 다루는 워커가 없으면 "앱 설치"를 띄우지 않는다.
 *  2. 네트워크가 끊긴 순간 흰 화면 대신 마지막 껍데기를 보여 준다.
 *
 * 캐시는 네트워크 우선이다. 전시 중 새로 배포해도 다음 접속에서 바로 새 화면이 뜬다.
 * 자바스크립트 묶음은 캐시하지 않는다. index.html 만 오래된 채 남으면 사라진 해시를
 * 가리켜 오히려 흰 화면이 된다. 이 앱은 어차피 서버 없이는 아무것도 못 한다.
 */
const CACHE_NAME = 'posttalk-shell-v3';
const SHELL = '/index.html';
const APP_SHELL = [SHELL, '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  // 하나라도 없으면 addAll 이 통째로 실패해 워커가 설치되지 않는다. 각각 따로 담는다.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 화면 이동만 다룬다. /api 호출과 영상·사진 업로드는 건드리지 않는다.
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;
  if (request.mode !== 'navigate') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        void caches.open(CACHE_NAME).then((cache) => cache.put(SHELL, copy));
        return response;
      })
      .catch(() => caches.match(SHELL).then((cached) => cached ?? Response.error())),
  );
});
