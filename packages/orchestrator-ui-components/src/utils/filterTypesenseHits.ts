import type {BaseHit, Hit} from "instantsearch.js";


export interface SearchHit extends Hit<BaseHit> {
    id: string;
    vector_distance?: number;
    rank_fusion_score?: number;
    customer_id: string;
    insync: string;
    description: string;
}


export type SearchHitFilterFunction = (hit: SearchHit) => boolean;

interface SearchFilters {
    vectorDistanceThreshold?: number;
    rankFusionScoreThreshold?: number;
}

/**
 * Creates a combined filter function that checks both vector distance and rank fusion score
 * @param filters - Object containing thresholds for both vector distance and rank fusion score
 * @returns A filter function that can be used with Array.filter()
 */
export const createCombinedFilter = (filters: SearchFilters): SearchHitFilterFunction => {
    return (hit: SearchHit): boolean => {
        // Check vector distance if threshold is provided
        if (filters.vectorDistanceThreshold !== undefined) {
            const distance = hit?.vector_distance;
            if (distance !== undefined && distance > filters.vectorDistanceThreshold) {
                return false;
            }
        }

        // Check rank fusion score if threshold is provided
        if (filters.rankFusionScoreThreshold !== undefined) {
            const score = hit?.rank_fusion_score;
            if (score !== undefined && score < filters.rankFusionScoreThreshold) {
                return false;
            }
        }

        return true;
    };
};

/**
 * Filters an array of hits based on both vector distance and rank fusion score
 * @param hits - Array of search hits to filter
 * @param filters - Object containing thresholds for filtering
 * @returns Filtered array of hits
 */
export const filterHits = (
    hits: SearchHit[],
    filters: SearchFilters
): SearchHit[] => {
    const filterFn = createCombinedFilter(filters);
    return hits.filter(filterFn);
};
