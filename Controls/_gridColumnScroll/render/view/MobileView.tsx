import * as React from 'react';
import { GridView as BaseView } from 'Controls/gridReact';
import {
    ColumnScrollContext,
    MirrorComponent,
    ShadowsComponent,
    ApplyCssTransformComponent,
    ColumnScrollUtils,
    ViewportObserverComponent,
} from 'Controls/columnScrollReact';
import { IInnerDeviceViewProps } from './interface';
import { MOBILE_MIRROR_JS_SELECTOR } from '../../Selectors';
import { useSizesSynchronizerComponent } from './mobileView/useSizesSynchronizer';

export default React.memo(
    React.forwardRef(function MobileViewColumnScroll(
        props: IInnerDeviceViewProps,
        forwardedRef: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const containerRef = React.useRef<HTMLDivElement>();

        React.useImperativeHandle(forwardedRef, () => {
            return containerRef.current;
        });

        const context = React.useContext(ColumnScrollContext);

        const [position, setPosition] = React.useState(context.position);

        const {onResizeCallback, SynchronizerComponent} = useSizesSynchronizerComponent({
            itemsSize: props.itemsSize
        });

        const onViewResized = React.useCallback(() => {
            onResizeCallback?.(containerRef.current);
            props.viewResized?.();
        }, [props.viewResized]);

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
            (context.isMobileScrolling ? context.SELECTORS.HIDE_ALL_FIXED_ELEMENTS : '');

        // FIXME: Удалить по проекту. View должна строиться по колонкам.
        const cCount = props.collection.getStickyColumnsCount() + +props.collection.hasMultiSelectColumn();

        return (
            <div
                ref={containerRef}
                className={props.viewClassName}
                style={
                    {
                        '--columnScrollTransform': `${position}px`,
                    } as React.CSSProperties
                }
            >
                <MirrorComponent className={MOBILE_MIRROR_JS_SELECTOR} />
                <ApplyCssTransformComponent />
                <ViewportObserverComponent />
                {SynchronizerComponent}

                {props.columnScrollViewMode !== 'unaccented' ? (
                    <ShadowsComponent leftShadowClassName={props.leftShadowClassName} />
                ) : undefined}

                <div
                    className={transformedWrapperClassName}
                    style={ColumnScrollUtils.getTransformCSSRuleReact(-context.position)}
                >
                    <BaseView
                        {...props}
                        viewResized={onViewResized}
                        beforeItemsContent={
                            <props.beforeItemsContentComponent {...props} part="scrollable" />
                        }
                    />
                </div>

                <div className={fixedWrapperClassName}>
                    <BaseView
                        {...props}
                        className={''}
                        /* @ts-ignore */
                        cCount={cCount}
                        itemsContainerReadyCallback={null}
                        viewResized={null}
                        beforeItemsContent={
                            <props.beforeItemsContentComponent {...props} part="fixed" />
                        }
                    />
                </div>
            </div>
        );
    })
);
