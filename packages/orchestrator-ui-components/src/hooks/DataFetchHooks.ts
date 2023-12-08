import { useContext } from 'react';
import { useQuery } from 'react-query';

import { OrchestratorConfigContext } from '@/contexts';
import {
    GraphqlFilter,
    ItemsList,
    ProcessDetailResultRaw,
    ProcessFromRestApi,
} from '@/types';

import { useQueryWithFetch } from './useQueryWithFetch';
import { useSessionWithToken } from './useSessionWithToken';

export type CacheNames = { [key: string]: string };

// todo: decide to remove from libaray (currently not used)
export const useFavouriteSubscriptions = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/subscriptions/?range=10%2C15`;
    const initialData: ItemsList = {
        buttonName: 'Show all favourites',
        items: [],
        title: 'Favourite Subscriptions',
        type: 'subscription',
    };

    const { data, isLoading } = useQueryWithFetch<
        ProcessFromRestApi[],
        Record<string, never>
    >(url, {}, 'favouriteSubscriptions');
    return isLoading ? initialData : { ...initialData, items: data || [] };
};

export const useProcessesAttention = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/processes/?range=100%2C105`;
    const initialData: ItemsList = {
        type: 'process',
        title: 'Processes that need attention',
        items: [],
        buttonName: 'Show all active processes',
    };

    const { data, isLoading } = useQueryWithFetch<
        ProcessFromRestApi[],
        Record<string, never>
    >(url, {}, 'processesAttention');
    return isLoading ? initialData : { ...initialData, items: data || [] };
};

export const useRecentProcesses = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/processes/?range=106%2C111`;
    const initialData: ItemsList = {
        type: 'process',
        title: 'Recently completed processes',
        items: [],
        buttonName: 'Show all completed processes',
    };

    const { data, isLoading } = useQueryWithFetch<
        ProcessFromRestApi[],
        Record<string, never>
    >(url, {}, 'recentProcesses');
    return isLoading ? initialData : { ...initialData, items: data || [] };
};

export const useRawProcessDetails = (processId: string) => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/processes/${processId}`;
    return useQueryWithFetch<ProcessDetailResultRaw, Record<string, never>>(
        url,
        {},
        `RawProcessDetails-${processId}`,
    );
};

export const useCacheNames = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/settings/cache-names`;
    return useQueryWithFetch<CacheNames, Record<string, never>>(
        url,
        {},
        'cacheNames',
    );
};

const filterDataByCriteria = <Type>(
    data: Type[],
    filterCriteria: GraphqlFilter<Type>[],
): Type[] => {
    return data.filter((item) => {
        return filterCriteria.some((filter) => {
            return item[filter.field] === filter.value;
        });
    });
};

export const useFilterQueryWithRest = <Type>(
    url: string,
    queryKey: string[],
    filters?: GraphqlFilter<Type>[],
    refetchInterval?: number,
) => {
    const { session } = useSessionWithToken();

    const fetchFromApi = async () => {
        const response = await fetch(url, {
            headers: {
                Authorization: session?.accessToken
                    ? `Bearer ${session.accessToken}`
                    : '',
            },
        });
        const data = await response.json();
        return filters ? filterDataByCriteria(data, filters) : data;
    };

    return useQuery(
        filters ? [...queryKey, { filters }] : [...queryKey],
        fetchFromApi,
        {
            refetchInterval,
        },
    );
};
