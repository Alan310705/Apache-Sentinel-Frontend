import { useQuery } from '@tanstack/react-query';
import { getLogs, PaginatedLogs } from '../api/logs';

export function useLogs(page: number = 1) {
    return useQuery<PaginatedLogs>({
        queryKey: ['logs', page],
        queryFn: () => getLogs(page),
        refetchInterval: 5000,
    });
}