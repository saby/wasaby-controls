/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
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
import {
    FIXED_VIEW_WRAPPER_CLASS_NAME,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
    MOBILE_MIRROR_JS_SELECTOR,
} from '../../Selectors';
import useSynchronizer from './mobileView/useSynchronizer';

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

        const { onResizeCallback: synchronizePartsOnResizeCallback, SynchronizerComponent } =
            useSynchronizer({
                itemsSizes: props.itemsSize,
                hasStickyHeader:
                    props.collection.hasHeader(true) && props.collection.isStickyHeader(),
                hasStickyTopResults:
                    props.collection.hasResults() &&
                    props.collection.isStickyResults() &&
                    props.collection.getResultsPosition() === 'top',
                synchronizeShadow: context.isMobileScrolling,
            });

        const onViewResized = React.useCallback(() => {
            synchronizePartsOnResizeCallback?.(containerRef.current);
            props.viewResized?.();
        }, [props.viewResized]);

        // После допиливания базовой вью, когда ее ресайзы будут стрелять правильно, этот код нужно убрать.
        React.useLayoutEffect(() => {
            synchronizePartsOnResizeCallback?.(containerRef.current);
        }, []);

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
        const cCount =
            props.collection.getStickyColumnsCount() + +props.collection.hasMultiSelectColumn();

        const mobileTransformStyles =
            `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${context.SELECTORS.FIXED_ELEMENT} {` +
            ColumnScrollUtils.getTransformCSSRule(0) +
            '}' +
            `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${context.SELECTORS.FIXED_ELEMENT} {` +
            ColumnScrollUtils.getTransformCSSRule('var(--columnScrollTransform)') +
            '}';

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
                <style>{mobileTransformStyles}</style>
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
