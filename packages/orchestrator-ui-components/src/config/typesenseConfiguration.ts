import {TypesenseConfig, TypesenseSearchFilterResultsParameters, TypesenseSearchParameters} from '../types';
import {getEnvironmentVariables} from '@/utils/getEnvironmentVariables';

// Define required environment variables
interface SearchEnvVars {
    NEXT_PUBLIC_TYPESENSE_HOST: string;
    NEXT_PUBLIC_TYPESENSE_PORT: string;
    NEXT_PUBLIC_TYPESENSE_PROTOCOL: string;
    NEXT_PUBLIC_TYPESENSE_API_KEY: string;
    NEXT_PUBLIC_VECTOR_DISTANCE_THRESHOLD: string;
}

// Get environment variables
const env = getEnvironmentVariables<SearchEnvVars>([
    'NEXT_PUBLIC_TYPESENSE_HOST',
    'NEXT_PUBLIC_TYPESENSE_PORT',
    'NEXT_PUBLIC_TYPESENSE_PROTOCOL',
    'NEXT_PUBLIC_TYPESENSE_API_KEY',
    'NEXT_PUBLIC_VECTOR_DISTANCE_THRESHOLD'
]);

// Default configuration
export const typesenseConfig: TypesenseConfig = {
    host: env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
    port: parseInt(env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
    protocol: (env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http') as 'http' | 'https',
    apiKey: env.NEXT_PUBLIC_TYPESENSE_API_KEY || 'xyz',
};

export const typesenseSearchFilterResultsParameters: TypesenseSearchFilterResultsParameters = {
        vector_distance: parseFloat(env.NEXT_PUBLIC_VECTOR_DISTANCE_THRESHOLD || '0.2'),
    };

// Search parameters configuration
export const defaultSearchParameters: TypesenseSearchParameters = {
    query_by: 'embedding',
    exclude_fields: ['embedding'],
    per_page: 6,
    num_typos: 2,
    exhaustive_search: true,
    prioritize_exact_match: true,
    rerank_hybrid_matches: true,
    vector_query: 'embedding:([], k:6, alpha:0.8)'
};
