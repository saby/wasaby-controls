/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { default as BaseView } from 'Controls/_grid/gridReact/view/View';
import {
    ColumnScrollContext,
    MirrorComponent,
    ShadowsComponent,
    ApplyCssTransformComponent,
    ColumnScrollUtils,
    ViewportObserverComponent,
    IColumnScrollContext,
} from 'Controls/columnScrollReact';
import { IInnerDeviceViewProps } from './interface';
import { SCROLLABLE_VIEW_WRAPPER_CLASS_NAME, MOBILE_MIRROR_JS_SELECTOR } from '../../Selectors';
import useSynchronizer from './mobileView/useSynchronizer';

const getMobileTransformStyles = (
    cCountStart: number,
    cCountEnd: number,
    context: IColumnScrollContext
) => {
    let styles = '';

    if (cCountStart) {
        // Стили для зафиксированных ячеек внутри "реальной" таблице
        const fixedRule = ColumnScrollUtils.getTransformCSSRule('var(--columnScrollTransform)');
        styles += `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${context.SELECTORS.FIXED_ELEMENT} {${fixedRule}}\n`;
    }
    if (cCountEnd) {
        // Стили для зафиксированных в конце ячеек внутри "реальной" таблице
        const fixedValue = `calc(var(--columnScrollTransform) - ${ColumnScrollUtils.getMaxScrollPosition(
            context
        )}px)`;
        const fixedRule = ColumnScrollUtils.getTransformCSSRule(fixedValue);
        styles += `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${context.SELECTORS.FIXED_TO_RIGHT_EDGE_ELEMENT} {${fixedRule}}\n`;
    }
    return styles;
};

export default React.memo(
    React.forwardRef(function MobileViewColumnScroll(
        props: IInnerDeviceViewProps,
        forwardedRef: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const containerRef = React.useRef<HTMLDivElement>(undefined as unknown as HTMLDivElement);

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
            synchronizePartsOnResizeCallback(containerRef.current);
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

        const realScrollableWrapperClassName =
            `${props.realScrollableWrapperClassName || ''} ` +
            (context.isMobileScrolling ? context.SELECTORS.HIDE_ALL_FIXED_ELEMENTS : '');

        // FIXME: Удалить по проекту. View должна строиться по колонкам.
        const cCountStart =
            props.collection.getStickyColumnsCount() !== 0
                ? props.collection.getStickyColumnsCount() +
                  +props.collection.hasMultiSelectColumn()
                : 0;
        const cCountEnd = props.collection.getEndStickyColumnsCount();

        const mobileTransformStyles = getMobileTransformStyles(cCountStart, cCountEnd, context);

        const ResolvedViewComponent = props.ViewComponent ?? BaseView;

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
                    className={realScrollableWrapperClassName}
                    style={ColumnScrollUtils.getTransformCSSRuleReact(-context.position)}
                    onFocus={props.onFocus}
                >
                    <ResolvedViewComponent
                        {...props}
                        viewResized={onViewResized}
                        beforeItemsContent={
                            <props.beforeItemsContentComponent {...props} part="scrollable" />
                        }
                    />
                </div>

                {props.fakeRequired === 'startFixed' || props.fakeRequired === 'both' ? (
                    <div
                        className={
                            props.fakeFixedStartWrapperClassName +
                            (context.isMobileScrolling ? ' tw-block' : ' tw-hidden')
                        }
                    >
                        <ResolvedViewComponent
                            {...props}
                            className={''}
                            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                            /* @ts-ignore */
                            cCountStart={cCountStart}
                            itemsContainerReadyCallback={undefined}
                            viewResized={undefined}
                            beforeItemsContent={
                                <props.beforeItemsContentComponent {...props} part="fixed" />
                            }
                        />
                    </div>
                ) : null}

                {props.fakeRequired === 'endFixed' || props.fakeRequired === 'both' ? (
                    <div
                        className={
                            props.fakeFixedEndWrapperClassName +
                            (context.isMobileScrolling ? ' tw-block' : ' tw-hidden')
                        }
                    >
                        <ResolvedViewComponent
                            {...props}
                            className={''}
                            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                            /* @ts-ignore */
                            cCountEnd={cCountEnd}
                            itemsContainerReadyCallback={undefined}
                            viewResized={undefined}
                            beforeItemsContent={
                                <props.beforeItemsContentComponent {...props} part="fixed" />
                            }
                        />
                    </div>
                ) : null}
            </div>
        );
    })
);
