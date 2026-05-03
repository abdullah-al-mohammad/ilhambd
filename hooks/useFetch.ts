import useSWR from 'swr';
import axiosInstance from '@/lib/axios';

const fetcher = <T>(url: string): Promise<T> =>
  axiosInstance.get<T>(url).then((res) => res.data);

export function useFetch<T>(url: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ?? null,
    refetch: mutate,
  };
}
