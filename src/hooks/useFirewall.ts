import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlockedIPs, PaginatedBlockedIPs, unblockIP, unblockAll, blockIP } from '../api/firewall';

export function useBlockedIPs(page: number = 1) {
    return useQuery({
        queryKey: ['firewall-rules', page],
        queryFn: () => getBlockedIPs(page),
        refetchInterval: 10000,
    });
}

export function useFirewallActions() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['firewall-rules'] });

  const unblockMutation = useMutation({
    mutationFn: unblockIP,
    onSuccess: invalidate,
  });

  const unblockAllMutation = useMutation({
    mutationFn: unblockAll,
    onSuccess: invalidate,
  });

  const blockMutation = useMutation({
    mutationFn: ({ ip, reason }: { ip: string; reason: string }) => blockIP(ip, reason),
    onSuccess: invalidate,
  });

  return {
    unblock:        unblockMutation.mutate,
    isUnblocking:   unblockMutation.isPending,
    unblockAll:     unblockAllMutation.mutate,
    isUnblockingAll: unblockAllMutation.isPending,
    block:          blockMutation.mutate,
    isBlocking:     blockMutation.isPending,
  };
}