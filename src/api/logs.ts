import { api } from './client';
import type { ApacheLog } from '../types/logs';
import type { PaginatedResponse } from '../types/pagination';

const PAGE_LIMIT = 100;

export interface PaginatedLogs extends PaginatedResponse<ApacheLog> {}

export const getLogs = async (page: number = 1): Promise<PaginatedLogs> => {
    const { data } = await api.get<PaginatedLogs>('/api/logs', {
        params: { page, limit: PAGE_LIMIT }
    });
    return data;
};
