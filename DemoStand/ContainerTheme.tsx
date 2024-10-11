import type { ReactElement, ForwardedRef } from 'react';
import { cloneElement, forwardRef } from 'react';
import { ThemeWrapper } from 'UI/Theme';

function ContainerTheme(
    props: { theme?: string; children: ReactElement },
    ref: ForwardedRef<unknown>
) {
    const staticTheme = props.theme;
    let zoom = 1;
    if ((staticTheme || '').includes('large')) {
        zoom = 1.33;
    }
    const activeTheme = staticTheme
        ? String(staticTheme).replace('-large', '').replace('-medium', '')
        : undefined;

    const fallBackActiveTheme: any = {
        error: 'fallback',
        selector: activeTheme,
    };

    return (
        <ThemeWrapper staticTheme={staticTheme} activeTheme={fallBackActiveTheme} ref={ref}>
            {cloneElement(props.children, {
                className: `${props.children?.props?.className || ''} controls-Zoom`,
                style: { zoom },
                theme: staticTheme,
            })}
        </ThemeWrapper>
    );
}

export default forwardRef(ContainerTheme);
