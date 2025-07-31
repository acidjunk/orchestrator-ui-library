import { useEffect, useState } from 'react';
import TypesenseInstantSearchAdapterModule from 'typesense-instantsearch-adapter';
import Typesense from 'typesense';
import { TypesenseSearchClient, TypesenseSchema } from '@/types';
import { typesenseConfig, typesenseSearchParameters } from '@/config/typesenseConfiguration';

// Workaround for TypesenseInstantSearchAdapter module format
const TypesenseInstantSearchAdapter =
    (TypesenseInstantSearchAdapterModule as any).default || TypesenseInstantSearchAdapterModule;

/**
 * Initialize Typesense client with configuration
 */
const client = new Typesense.Client({
    nodes: [{
        host: typesenseConfig.host,
        port: typesenseConfig.port,
        protocol: typesenseConfig.protocol,
    }],
    apiKey: typesenseConfig.apiKey,
});

/**
 * Hook for initializing and managing Typesense search adapter
 * @param collectionName - Name of the Typesense collection to search
 * @returns Configured search client or null while initializing
 */
export function useTypesenseAdapter(collectionName: string): TypesenseSearchClient | null {
    const [searchClient, setSearchClient] = useState<TypesenseSearchClient | null>(null);

    useEffect(() => {
        async function initAdapter() {
            try {
                // Fetch collection schema
                const schema = await client.collections<TypesenseSchema>(collectionName).retrieve();

                // Get searchable string fields from schema
                const stringFields = schema.fields
                    .filter(f => f.type === 'string' || f.type === 'string[]')
                    .map(f => f.name)
                    .join(',');

                // Configure search parameters
                const searchParameters = {
                    ...typesenseSearchParameters,
                    query_by: `embedding,${stringFields}`,
                };

                // Initialize adapter with configuration
                const adapter = new TypesenseInstantSearchAdapter({
                    server: {
                        apiKey: typesenseConfig.apiKey,
                        nodes: [{
                            host: typesenseConfig.host,
                            port: typesenseConfig.port,
                            protocol: typesenseConfig.protocol,
                        }],
                    },
                    additionalSearchParameters: searchParameters,
                });

                setSearchClient(adapter.searchClient);
            } catch (error) {
                console.error('Failed to initialize Typesense adapter:', error);
                setSearchClient(null);
            }
        }

        initAdapter().then(r =>{} );
    }, [collectionName]);

    return searchClient;
}
