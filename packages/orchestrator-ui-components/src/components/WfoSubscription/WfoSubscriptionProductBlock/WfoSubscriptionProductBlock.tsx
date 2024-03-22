import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
    EuiBadge,
    EuiButtonEmpty,
    EuiCodeBlock,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { PATH_SUBSCRIPTIONS, WfoProductBlockKeyValueRow } from '@/components';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { FieldValue, InUseByRelation } from '@/types';

import { getStyles } from './styles';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from '../utils';

interface WfoSubscriptionProductBlockProps {
    ownerSubscriptionId: string;
    subscriptionInstanceId: string;
    productBlockInstanceValues: FieldValue[];
    inUseByRelations: InUseByRelation[];
    id: number;
}

export const HIDDEN_KEYS = ['title', 'name', 'label'];

export const WfoSubscriptionProductBlock = ({
    ownerSubscriptionId,
    subscriptionInstanceId,
    productBlockInstanceValues,
    inUseByRelations,
}: WfoSubscriptionProductBlockProps) => {
    const router = useRouter();
    const subscriptionId = router.query['subscriptionId'];

    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const {
        productBlockIconStyle,
        productBlockPanelStyle,
        productBlockLeftColStyle,
        productBlockRightColStyle,
        productBlockRowStyle,
    } = useWithOrchestratorTheme(getStyles);

    const [hideDetails, setHideDetails] = useState(true);

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel
                color="transparent"
                hasShadow={false}
                css={productBlockPanelStyle}
            >
                <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                        <div css={productBlockIconStyle}>
                            <EuiIcon
                                type="filebeatApp"
                                color={theme.colors.primary}
                            />
                        </div>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiText grow={true}>
                            <h3>
                                {getProductBlockTitle(
                                    productBlockInstanceValues,
                                )}
                            </h3>
                        </EuiText>
                        <EuiText size="s">
                            {getFieldFromProductBlockInstanceValues(
                                productBlockInstanceValues,
                                'name',
                            )}
                        </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty
                            aria-label={
                                hideDetails
                                    ? t('showDetails')
                                    : t('hideDetails')
                            }
                            size={'m'}
                            onClick={() => setHideDetails(!hideDetails)}
                        >
                            {hideDetails ? t('showDetails') : t('hideDetails')}
                        </EuiButtonEmpty>
                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size={'m'}></EuiSpacer>
                {
                    <table width="100%">
                        <tbody>
                            {!hideDetails && (
                                <>
                                    <tr key={-3} css={productBlockRowStyle}>
                                        <td
                                            css={productBlockLeftColStyle}
                                        >
                                            <b>{t('subscriptionInstanceId')}</b>
                                        </td>
                                        <td
                                            css={productBlockRightColStyle}
                                        >
                                            {subscriptionInstanceId}
                                        </td>
                                    </tr>
                                    <tr key={-2} css={productBlockRowStyle}>
                                        <td css={productBlockLeftColStyle}>
                                            <b>{t('ownerSubscriptionId')}</b>
                                        </td>
                                        <td css={productBlockRightColStyle}>
                                            {subscriptionId ===
                                            ownerSubscriptionId ? (
                                                <>
                                                    <EuiBadge>
                                                        {t('self')}
                                                    </EuiBadge>
                                                </>
                                            ) : (
                                                <a
                                                    href={`${PATH_SUBSCRIPTIONS}/${ownerSubscriptionId}`}
                                                    target="_blank"
                                                >
                                                    {ownerSubscriptionId}
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                    <tr key={-1} css={productBlockRowStyle}>
                                        <td css={productBlockLeftColStyle}>
                                            <b>{t('inUseByRelations')}</b>
                                        </td>
                                        <td css={productBlockRightColStyle}>
                                            {/* Todo use the Wfo version */}
                                            <EuiCodeBlock language="json">
                                                {JSON.stringify(
                                                    inUseByRelations,
                                                    null,
                                                    4,
                                                )}
                                            </EuiCodeBlock>
                                        </td>
                                    </tr>
                                </>
                            )}

                            {productBlockInstanceValues
                                .filter(
                                    (productBlockInstanceValue) =>
                                        !HIDDEN_KEYS.includes(
                                            productBlockInstanceValue.field,
                                        ),
                                )
                                .map((productBlockInstanceValue, index) => (
                                    <WfoProductBlockKeyValueRow
                                        fieldValue={productBlockInstanceValue}
                                        key={index}
                                    />
                                ))}
                        </tbody>
                    </table>
                }
            </EuiPanel>
        </>
    );
};