import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const codeBlockStyle = css({
        marginBottom: theme.size.l,
        borderRadius: theme.border.radius.medium,
    });

    return {
        codeBlockStyle,
    };
};