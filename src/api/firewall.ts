import { api } from './client';
import type { BlockedIP } from '../types/firewall';
import type { PaginatedResponse, PaginationMeta } from '../types/pagination';

const PAGE_LIMIT = 100;

export interface PaginatedBlockedIPs extends PaginatedResponse<BlockedIP> {}

export const getBlockedIPs = async (page: number = 1): Promise<PaginatedBlockedIPs> => {
    const { data } = await api.get<PaginatedBlockedIPs>('/api/firewall/rules', {
        params: { page, limit: PAGE_LIMIT }
    });
    return data;
};

export const unblockIP = async (ip: string): Promise<void> => {
    await api.post('/api/firewall/unblock', { ip });
};

export const unblockAll = async (): Promise<{ revoked: number }> => {
    const { data } = await api.post<{ revoked: number }>('/api/firewall/unblock-all', {});
    return data;
};

export const blockIP = async (ip: string, reason: string): Promise<void> => {
    await api.post('/api/firewall/block', { ip, reason });
};
