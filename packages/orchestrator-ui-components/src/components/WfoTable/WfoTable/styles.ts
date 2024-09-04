import { CSSProperties } from 'react';

import { css, keyframes } from '@emotion/react';
import { WfoTheme } from '@orchestrator-ui/orchestrator-ui-components';

export const getWfoTableStyles = ({ theme }: WfoTheme) => {
    const radius = theme.border.radius.medium;

    const tableLoadingLineKeyframes = keyframes({
        from: {
            left: 0,
            width: 0,
        },
        '20%': {
            left: 0,
            width: '40%',
        },
        '80%': {
            left: '60%',
            width: '40%',
        },
        '100%': {
            left: '100%',
            width: 0,
        },
    });

    const tableContainerStyle = css({
        overflowX: 'auto',
    });

    const tableStyle = css({
        width: '100%',
    });

    const headerStyle = css({
        backgroundColor: theme.colors.lightShade,
        fontSize: theme.size.m,
        textAlign: 'left',
        'tr>:first-child': {
            borderTopLeftRadius: radius,
        },
        'tr>:last-child': {
            borderTopRightRadius: radius,
        },
    });

    const bodyLoadingStyle = css({
        position: 'relative',
        overflow: 'hidden',

        '&::before': {
            position: 'absolute',
            content: '""',
            height: theme.border.width.thick,
            backgroundColor: theme.colors.primary,
            animation: `${tableLoadingLineKeyframes} 1s linear infinite`,
        },
    });

    const rowStyle = css({
        height: '40px',
        borderStyle: 'solid',
        borderWidth: '0 0 1px 0',
        borderColor: theme.colors.lightShade,
    });

    const dataRowStyle = css({
        '&:hover': {
            backgroundColor: theme.colors.lightestShade,
        },
    });

    const expandedRowStyle = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const cellStyle = css({
        paddingLeft: theme.size.m,
        paddingRight: theme.size.m,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
    });

    const emptyTableMessageStyle = css({
        textAlign: 'center',
    });

    const clickableStyle = css({
        cursor: 'pointer',
    });

    const setWidth = (width?: CSSProperties['width']) =>
        width !== undefined &&
        css({
            width: width,
            minWidth: width,
            maxWidth: width,
            overflow: 'hidden',
        });

    return {
        tableContainerStyle,
        tableStyle,
        headerStyle,
        bodyLoadingStyle,
        rowStyle,
        dataRowStyle,
        expandedRowStyle,
        cellStyle,
        emptyTableMessageStyle,
        clickableStyle,
        setWidth,
    };
};
