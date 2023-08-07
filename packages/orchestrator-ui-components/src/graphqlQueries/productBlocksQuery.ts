import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { SortOrder } from '../types';

import type { ProductBlockDefinition } from '../types';
import { GraphqlQueryVariables, ProductBlockDefinitionsResult } from '../types';

export const DEFAULT_SORT_FIELD: keyof ProductBlockDefinition = 'name';
export const DEFAULT_SORT_ORDER: SortOrder = SortOrder.DESC;

export const GET_PRODUCTS_BLOCKS_GRAPHQL_QUERY: TypedDocumentNode<
    ProductBlockDefinitionsResult,
    GraphqlQueryVariables<ProductBlockDefinition>
> = parse(gql`
    query MetadataProductBlocks(
        $first: IntType!
        $after: IntType!
        $sortBy: [GraphqlSort!]
    ) {
        productBlocks(first: $first, after: $after, sortBy: $sortBy) {
            page {
                productBlockId
                name
                tag
                description
                status
                createdAt
                endDate
                resourceTypes {
                    description
                    resourceType
                    resourceTypeId
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
            }
        }
    }
`);