import React, {useState, useMemo, useEffect} from 'react';
import {
    EuiFieldSearch,
    EuiPopover,
    EuiPanel,
    EuiText,
    EuiSpacer,
} from '@elastic/eui';
import Link from 'next/link';
import {
    InstantSearch,
    Configure,
    useSearchBox,
    useHits,
} from 'react-instantsearch';

import { VectorSearchHit, filterHitsByVectorDistance } from '@/utils/filterTypesenseHits';
import { getEnvironmentVariables } from '@/utils/getEnvironmentVariables';
import {useTypesenseAdapter} from '@/hooks/useTypesenseAdapter';
import { debounce } from 'lodash';
import type {BaseHit} from "instantsearch.js";

const env = getEnvironmentVariables<{ NEXT_PUBLIC_VECTOR_DISTANCE_THRESHOLD: string }>([
    'NEXT_PUBLIC_VECTOR_DISTANCE_THRESHOLD'
]);

const vectorDistanceThreshold = parseFloat(env.NEXT_PUBLIC_VECTOR_DISTANCE_THRESHOLD || '0.2');

interface CustomSearchBoxProps {
    onFocus: () => void;
    onBlur: () => void;
}

const CustomSearchBox: React.FC<CustomSearchBoxProps> = ({ onFocus, onBlur }) => {
    const { query, refine } = useSearchBox();
    const [inputValue, setInputValue] = useState(query);

    const debouncedRefine = useMemo(
        () => debounce((value: string) => {
            if (value.length >= 2) {
                refine(value);
            } else {
                refine('');
            }
        }, 300),
        [refine]
    );

    useEffect(() => {
        debouncedRefine(inputValue);
        return () => {
            debouncedRefine.cancel();
        };
    }, [inputValue, debouncedRefine]);

    return (
        <EuiFieldSearch
            fullWidth
            style={{width: '100%', maxWidth: '750px'}}
            placeholder="Search subscriptions..."
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            isClearable
        />
    );
};



interface CustomHitsProps {
    closePopover: () => void;
}


// Custom Hits using EUI
const CustomHits = ({closePopover}: CustomHitsProps) => {
    const {items} = useHits<VectorSearchHit>();

    // Apply vector distance filtering
    const filteredHits = filterHitsByVectorDistance(items, vectorDistanceThreshold);

    return (
        <>
            {filteredHits.length === 0 && (
                <EuiText size="s" color="subdued" style={{padding: '0.5rem'}}>
                    No results found.
                </EuiText>
            )}
            {filteredHits.map((searchHit: VectorSearchHit) => {
                // Skip rendering if required fields are missing
                if (!searchHit?.id || !searchHit?.customer_id) {
                    return null;
                }

                return (
                    <Link key={searchHit.id} href={`/subscriptions/${searchHit.id}`} legacyBehavior>
                        <a
                            onClick={closePopover}
                            style={{textDecoration: 'none'}}
                        >
                            <EuiPanel paddingSize="s" hasShadow={false} color="subdued">
                                <EuiText size="s">
                                    <strong>
                                        {searchHit.customer_id + ' | ' + (searchHit.shop?.customer?.billing_contact_name || 'N/A')}
                                    </strong>
                                    <br/>
                                    <span>
                                        {searchHit.description || 'No description'}
                                    </span>
                                </EuiText>
                            </EuiPanel>
                            <EuiSpacer size="xs"/>
                        </a>
                    </Link>
                );
            })}
        </>
    );
};

interface SearchFunctionParams {
    query: string;
    refine: (query: string) => void;
}

// Main component
const SearchBox = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const searchClient = useTypesenseAdapter('subscriptions');

    if (!searchClient) return <div>Loading search...</div>;

    const handleBlur = () => {
        setTimeout(() => {
            if (
                document.activeElement &&
                !document
                    .querySelector('.typesense-search-popover')
                    ?.contains(document.activeElement)
            ) {
                setIsPopoverOpen(false);
            }
        }, 150);
    };

    return (
        <InstantSearch
            indexName="subscriptions"
            searchClient={searchClient}
        >
            <Configure hitsPerPage={6}/>
            <EuiPopover
                isOpen={isPopoverOpen}
                closePopover={() => setIsPopoverOpen(false)}
                panelPaddingSize="none"
                style={{width: '100%', maxWidth: '750px'}}
                panelStyle={{width: '100%', maxWidth: '750px', maxHeight: 300, overflowY: 'auto'}}
                anchorPosition="downCenter"
                panelClassName="typesense-search-popover"
                ownFocus
                button={
                    <CustomSearchBox
                        onFocus={() => setIsPopoverOpen(true)}
                        onBlur={handleBlur}
                    />
                }
            >
                <div style={{padding: '0.5rem'}}>
                    <CustomHits closePopover={() => setIsPopoverOpen(false)}/>
                </div>
            </EuiPopover>
        </InstantSearch>
    );
};

export default SearchBox;
