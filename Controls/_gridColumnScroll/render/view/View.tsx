/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { gridViewPropsAreEqual } from 'Controls/gridReact';
import { IGridViewColumnScrollProps, IInnerDeviceViewProps } from './interface';
import MobileViewColumnScroll from './MobileView';
import DesktopViewColumnScroll from './DesktopView';
import { FIXED_VIEW_WRAPPER_CLASS_NAME, SCROLLABLE_VIEW_WRAPPER_CLASS_NAME } from '../../Selectors';
import {
    ColumnScrollContext,
    DragScrollContext,
    ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME,
} from 'Controls/columnScrollReact';
import 'css!Controls/gridColumnScroll';
import BeforeItemsContent, { IBeforeItemsContentProps } from './BeforeItemsContent';

export { IGridViewColumnScrollProps };

interface IViewChooserProps
    extends IGridViewColumnScrollProps,
        Pick<
            IInnerDeviceViewProps,
            | 'transformedWrapperClassName'
            | 'fixedElementClassName'
            | 'shouldUseFakeRender'
            | 'beforeItemsContentComponent'
        > {
    isMobile: boolean;
    shouldAddAccelerationOnRoot: boolean;
}

function BeforeItemsContentComponent(
    props: IInnerDeviceViewProps & Pick<IBeforeItemsContentProps, 'part'>
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
            columnScrollViewMode={props.collection.getColumnScrollViewMode()}
            stickyColumnsCount={props.collection.getStickyColumnsCount()}
            endStickyColumnsCount={props.collection.getEndStickyColumnsCount()}
            hasMultiSelectColumn={props.collection.hasMultiSelectColumn()}
            children={props.beforeItemsContent}
        />
    );
}

function getClassNamePropsForDevice(
    device: 'mobile' | 'desktop',
    transformedWrapperClassName: string,
    fixedElementClassName: string,
    shouldAddAccelerationOnRoot: boolean,
    hasColumnsSeparator: boolean
): Pick<
    IInnerDeviceViewProps,
    | 'fixedWrapperClassName'
    | 'viewClassName'
    | 'transformedWrapperClassName'
    | 'hydrationPreRenderClassName'
    | 'fixedElementClassName'
    | 'leftShadowClassName'
> {
    // TODO: Тесты:
    //  1. свои классы от двух устройств,
    //  2. классы из опций,
    //  3. классы акселерации для устройств (сделать пометку что нельзя вешать класс, который
    //  вырезает контент на новый контекст выше чем оверлэй скроллирования мышью)
    //  #TEST
    return {
        hydrationPreRenderClassName:
            'controls-GridReact__view_columnScroll_hydrationPreRender ' +
            `controls-GridReact__view_columnScroll_hydrationPreRender_${device}`,
        viewClassName:
            'controls-GridReact__view_columnScroll ' +
            `controls-GridReact__view_columnScroll_${device} ` +
            (shouldAddAccelerationOnRoot ? `${ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME} ` : ''),
        fixedWrapperClassName:
            `${FIXED_VIEW_WRAPPER_CLASS_NAME} ` +
            `controls-GridReact__view_columnScroll_${device}_fixed `,
        fixedElementClassName,
        transformedWrapperClassName:
            `${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} ` +
            `controls-GridReact__view_columnScroll_${device}_scrollable ` +
            (device === 'mobile' ? `${ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME} ` : '') +
            transformedWrapperClassName,
        leftShadowClassName: hasColumnsSeparator
            ? 'controls-GridReact__view_columnScroll__shadowLeft_hideSeparator'
            : '',
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
                props.transformedWrapperClassName,
                props.fixedElementClassName,
                props.shouldAddAccelerationOnRoot,
                props.collection.getColumnSeparatorSize() !== 'null'
            ),
        };

        if (props.isMobile) {
            return <MobileViewColumnScroll {...commonProps} />;
        } else {
            return <DesktopViewColumnScroll {...commonProps} itemsSize={null} />;
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

        // Фейковая верстка должна быть отрисована при построении,
        // если передана опция показа с конечной позиции скролла.
        // При этом фейковый рендер будет скрыт после расчета всех размеров,
        // когда станет возможно отобразить реальную проскроленную таблицу.
        const [shouldUseFakeRender, setShouldUseFakeRender] = React.useState(
            props.collection.getColumnScrollStartPosition() === 'end'
        );

        // После построения контрола и пересчета размеров, фейковая верстка должна быть скрыта.
        React.useEffect(() => {
            if (shouldUseFakeRender && columnScrollContext.isNeedByWidth) {
                setShouldUseFakeRender(false);
            }
        }, [columnScrollContext.isNeedByWidth, shouldUseFakeRender]);

        return (
            <MemoViewChooser
                ref={ref}
                {...props}
                shouldAddAccelerationOnRoot={shouldAddAccelerationOnRoot}
                shouldUseFakeRender={shouldUseFakeRender}
                fixedElementClassName={columnScrollContext.SELECTORS.FIXED_ELEMENT}
                transformedWrapperClassName={columnScrollContext.SELECTORS.ROOT_TRANSFORMED_ELEMENT}
                isMobile={columnScrollContext.isMobile}
                beforeItemsContentComponent={BeforeItemsContentComponent}
            />
        );
    }),
    gridViewPropsAreEqual
);
