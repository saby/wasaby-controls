/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { IGridViewColumnScrollProps, IInnerDeviceViewProps } from './interface';
import MobileViewColumnScroll from './MobileView';
import DesktopViewColumnScroll from './DesktopView';
import {
    FIXED_START_VIEW_WRAPPER_CLASS_NAME,
    FIXED_END_VIEW_WRAPPER_CLASS_NAME,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
} from '../../Selectors';
import {
    ColumnScrollContext,
    DragScrollContext,
    ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME,
} from 'Controls/columnScrollReact';
import 'css!Controls/gridColumnScroll';
import BeforeItemsContent, { IBeforeItemsContentProps } from './BeforeItemsContent';
import { gridViewPropsAreEqual } from 'Controls/_gridColumnScroll/common/grid';

export { IGridViewColumnScrollProps };

interface IViewChooserProps
    extends IGridViewColumnScrollProps,
        Pick<
            IInnerDeviceViewProps,
            | 'realScrollableWrapperClassName'
            | 'beforeItemsContentComponent'
            | 'onFocus'
            | 'fakeRequired'
        > {
    isMobile: boolean;
    shouldAddAccelerationOnRoot: boolean;
    isDragScrollEnabled: boolean;
    backgroundStyle?: string;
}

function BeforeItemsContentComponent(
    props: IInnerDeviceViewProps &
        Pick<IBeforeItemsContentProps, 'part'> &
        Pick<IBeforeItemsContentProps, 'columnScrollArrowButtonsStyle'>
) {
    return (
        <BeforeItemsContent
            part={props.part}
            columnScrollNavigationPosition={props.collection.getColumnScrollNavigationPosition()}
            hasResizer={!!props.collection.hasResizer()}
            hasGridStickyHeader={
                !!props.collection.isStickyHeader() && !!props.collection.hasHeader()
            }
            hasColumnScrollCustomAutoScrollTargets={props.collection.hasColumnScrollCustomAutoScrollTargets()}
            columnsCount={props.collection.getGridColumnsConfig().length}
            columnScrollViewMode={props.collection.getColumnScrollViewMode() || 'scrollbar'}
            stickyColumnsCount={props.collection.getStickyColumnsCount()}
            endStickyColumnsCount={props.collection.getEndStickyColumnsCount()}
            hasMultiSelectColumn={props.collection.hasMultiSelectColumn()}
            children={props.beforeItemsContent}
            columnScrollArrowButtonsStyle={props.columnScrollArrowButtonsStyle}
        />
    );
}

function getClassNamePropsForDevice(
    device: 'mobile' | 'desktop',
    fakeRequired: IInnerDeviceViewProps['fakeRequired'],
    realScrollableWrapperClassName: string,
    shouldAddAccelerationOnRoot: boolean,
    hasColumnsSeparator: boolean,
    isDragScrollEnabled: boolean,
    backgroundStyle?: string
): Pick<
    IInnerDeviceViewProps,
    | 'fakeFixedStartWrapperClassName'
    | 'fakeFixedEndWrapperClassName'
    | 'viewClassName'
    | 'realScrollableWrapperClassName'
    | 'leftShadowClassName'
    | 'rightShadowClassName'
> {
    let leftShadowClassName = '';
    let rightShadowClassName = '';
    if (backgroundStyle) {
        leftShadowClassName += ` controls-ColumnScroll__shadow-${backgroundStyle}`;
        rightShadowClassName += ` controls-ColumnScroll__shadow-${backgroundStyle}`;
    }
    if (hasColumnsSeparator) {
        leftShadowClassName += ' controls-GridReact__view_columnScroll__shadowLeft_hideSeparator';
    }
    // TODO: Тесты:
    //  1. свои классы от двух устройств,
    //  2. классы из опций,
    //  3. классы акселерации для устройств (сделать пометку что нельзя вешать класс, который
    //  вырезает контент на новый контекст выше чем оверлэй скроллирования мышью)
    //  #TEST
    return {
        viewClassName:
            'controls-GridReact__view_columnScroll ' +
            `controls-GridReact__view_columnScroll_${device} ` +
            (fakeRequired
                ? `controls-GridReact__view_columnScroll_useFake-${fakeRequired}_${device} `
                : '') +
            (shouldAddAccelerationOnRoot ? `${ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME} ` : '') +
            (isDragScrollEnabled ? 'controls-GridReact__view_dragScroll' : '') +
            ' tw-h-full',
        fakeFixedStartWrapperClassName: FIXED_START_VIEW_WRAPPER_CLASS_NAME,
        fakeFixedEndWrapperClassName: FIXED_END_VIEW_WRAPPER_CLASS_NAME,
        realScrollableWrapperClassName:
            `${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} ` +
            `controls-GridReact__view_columnScroll_${device}_scrollable ` +
            (device === 'mobile' ? `${ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME} ` : '') +
            realScrollableWrapperClassName +
            ' tw-h-full',
        leftShadowClassName,
        rightShadowClassName,
    };
}

const MemoViewChooser = React.memo(
    React.forwardRef(function ViewChooser(
        props: IViewChooserProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.FunctionComponentElement<IViewChooserProps> {
        const commonProps = {
            ref,
            ...props,
            ...getClassNamePropsForDevice(
                props.isMobile ? 'mobile' : 'desktop',
                props.fakeRequired,
                props.realScrollableWrapperClassName,
                props.shouldAddAccelerationOnRoot,
                props.collection.getColumnSeparatorSize() !== 'null',
                props.isDragScrollEnabled,
                props.backgroundStyle
            ),
        };

        if (props.isMobile) {
            return <MobileViewColumnScroll {...commonProps} />;
        } else {
            return <DesktopViewColumnScroll {...commonProps} itemsSize={undefined} />;
        }
    })
);

export default React.memo(
    React.forwardRef(function ViewColumnScroll(
        props: IGridViewColumnScrollProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const columnScrollContext = React.useContext(ColumnScrollContext);
        const dragScrollContext = React.useContext(DragScrollContext);

        const shouldAddAccelerationOnRoot =
            columnScrollContext.isMobile || !dragScrollContext.isOverlayShown;

        const _onFocus = React.useCallback<React.FocusEventHandler>(
            (e: React.FocusEvent) => {
                const target = e.target as HTMLElement;

                if (
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    (target.className?.indexOf?.('js-controls-Field') &&
                        target.className?.indexOf?.('js-controls-Field') !== -1)
                ) {
                    // Подскроливаем к ячейке с полем ввода, чтобы она была полностью видна перед активацией.
                    // Если ячейка заколспанена, скролим к полю ввода, т.к. она может быть шире всей видимой области.
                    const isCellColspaned = !!target.closest('.js-controls-Grid__cell_colspaned');
                    const correctTarget =
                        target.closest(
                            isCellColspaned ? '.js-controls-Render' : '.controls-GridReact__cell'
                        ) || target;

                    if (correctTarget) {
                        columnScrollContext.scrollIntoView(correctTarget);
                    }
                }
            },
            [columnScrollContext]
        );
        const endStickyColumnsCount = props.collection.getEndStickyColumnsCount();
        // Фейковая верстка частей таблицы.
        // Единый подход для решения проблем как в мобильной адаптации, так и в десктопе.
        // В десктопе используется для серверного рендеринга, исключая скачок при построении.
        // С сервера прилетает вёрстка, визуальна неотличимая от проскроленной таблицы,
        // сохранена фиксация колонок слева и справа.
        // В мобильной адаптации, помимо этого используется при скроллировании.
        // При скроллировании в мобильной адаптации отображается 1 таблица со скрытыми фиксированными ячейками.
        // И по таблице на левую и правую область фиксации.
        // Данный подход наиболее производительный, т.к. двигать нужно только сами таблицы, а не все ячейки.
        const fakeRequired = React.useMemo<IInnerDeviceViewProps['fakeRequired']>(() => {
            // На мобилке всегда, если есть фиксация.
            // На десктопе только если есть фиксация и идет первое построение с изначальной прокруткой вконец.
            const needStartFake =
                !!props.collection.getStickyColumnsCount() &&
                (columnScrollContext.isMobile ||
                    (props.collection.getColumnScrollStartPosition() === 'end' &&
                        !columnScrollContext.isInitializedSizes));

            // На мобилке всегда, если есть фиксация.
            // На десктопе только если есть фиксация и идет первое построение с изначальной прокруткой НЕ вконец.
            const needEndFake =
                !!props.collection.getEndStickyColumnsCount() &&
                (columnScrollContext.isMobile ||
                    (props.collection.getColumnScrollStartPosition() !== 'end' &&
                        !columnScrollContext.isInitializedSizes));

            if (!needStartFake && !needEndFake) {
                return undefined;
            } else if (needStartFake && needEndFake) {
                return 'both';
            } else if (needStartFake) {
                return 'startFixed';
            } else {
                return 'endFixed';
            }
            // После построения контрола и пересчета размеров, фейковая верстка должна быть скрыта.
        }, [columnScrollContext.isInitializedSizes, endStickyColumnsCount]);

        return (
            <MemoViewChooser
                ref={ref}
                {...props}
                onFocus={_onFocus}
                shouldAddAccelerationOnRoot={shouldAddAccelerationOnRoot}
                fakeRequired={fakeRequired}
                realScrollableWrapperClassName={
                    columnScrollContext.SELECTORS.ROOT_TRANSFORMED_ELEMENT
                }
                isMobile={columnScrollContext.isMobile}
                beforeItemsContentComponent={BeforeItemsContentComponent}
                isDragScrollEnabled={dragScrollContext.isEnabled}
            />
        );
    }),
    gridViewPropsAreEqual
);
