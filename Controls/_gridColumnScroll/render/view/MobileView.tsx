import * as React from 'react';
import { GridView as BaseView } from 'Controls/gridReact';
import {
    ColumnScrollContext,
    MirrorComponent,
    ShadowsComponent,
    ApplyCssTransformComponent,
    ColumnScrollUtils,
} from 'Controls/columnScrollReact';
import { IInnerDeviceViewProps } from './interface';

export function MobileViewColumnScroll(
    props: IInnerDeviceViewProps
): React.ReactElement {
    const context = React.useContext(ColumnScrollContext);

    const [position, setPosition] = React.useState(context.position);

    if (
        position !== context.position &&
        (!context.isMobile || (context.isMobile && !context.isMobileScrolling))
    ) {
        setPosition(context.position);
    }

    const fixedWrapperClassName =
        `${props.fixedWrapperClassName || ''} ` +
        (context.isMobileScrolling ? 'tw-block' : 'tw-hidden');

    const transformedWrapperClassName =
        `${props.transformedWrapperClassName || ''} ` +
        (context.isMobileScrolling
            ? context.SELECTORS.HIDE_ALL_FIXED_ELEMENTS
            : '');

    // FIXME: Удалить по проекту. View должна строиться по колонкам.
    const cCount =
        props.stickyColumnsCount +
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        +(
            props.multiSelectVisibility !== 'hidden' &&
            props.multiSelectPosition !== 'custom'
        );

    return (
        <div
            className={props.viewClassName}
            style={
                {
                    '--columnScrollTransform': `${position}px`,
                } as React.CSSProperties
            }
        >
            <MirrorComponent />
            <ApplyCssTransformComponent />

            {props.columnScrollViewMode !== 'unaccented' ? (
                <ShadowsComponent />
            ) : undefined}

            <div
                className={transformedWrapperClassName}
                style={ColumnScrollUtils.getTransformCSSRuleReact(
                    -context.position
                )}
            >
                <BaseView {...props} />
            </div>

            <div className={fixedWrapperClassName}>
                {/* @ts-ignore */}
                <BaseView
                    {...props}
                    className={''}
                    cCount={cCount}
                    renderFakeHeader={
                        props.columnScrollViewMode !== 'unaccented' &&
                        props.columnScrollNavigationPosition !== 'custom'
                    }
                />
            </div>
        </div>
    );
}
