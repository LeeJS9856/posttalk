import { api } from '@/apis/api';

export interface ServerHealth {
  status: 'ok';
  service: string;
  timestamp: string;
}

export const getServerHealth = ({ signal }: { signal?: AbortSignal } = {}) =>
  api<ServerHealth>({
    path: '/api/health',
    signal,
  });
