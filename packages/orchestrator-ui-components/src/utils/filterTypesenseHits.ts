import type {BaseHit} from "instantsearch.js";

/**
 * Represents a search hit with vector distance information
 */
export interface VectorSearchHit extends BaseHit
{
    id: string;
    vector_distance?: number;
    customer_id: string;
    insync: string;
    description: string;
}

/**
 * Filter function type for vector-based search results
 */
export type VectorFilterFunction = (hit: VectorSearchHit) => boolean;

/**
 * Creates a vector distance filter function with a configurable threshold
 * @param threshold - Maximum allowed vector distance (0 to 1)
 * @returns A filter function that can be used with Array.filter()
 */
export const createVectorDistanceFilter = (threshold: number): VectorFilterFunction => {
    return (hit: VectorSearchHit): boolean => {
        const distance = hit?.vector_distance;
        return distance === undefined || distance <= threshold;
    };
};

/**
 * Filters an array of hits based on vector distance
 * @param hits - Array of search hits to filter
 * @param threshold - Maximum allowed vector distance (0 to 1)
 * @returns Filtered array of hits
 */
export const filterHitsByVectorDistance = (
    hits: VectorSearchHit[],
    threshold: number
): VectorSearchHit[] => {
    const filterFn = createVectorDistanceFilter(threshold);
    return hits.filter(filterFn);
};
