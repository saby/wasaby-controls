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
            columnScrollViewMode={props.collection.getColumnScrollViewMode()}
            stickyColumnsCount={props.collection.getStickyColumnsCount()}
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

// TODO #Test на весь функционал.
//  Первая часть тестов - изолированные тесты логики этой либы
//  Вторая под вопросам, нужно проверить работу на стыке базовой вьюхи и этой.
export default React.memo(
    React.forwardRef(function ViewColumnScroll(
        props: IGridViewColumnScrollProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const columnScrollContext = React.useContext(ColumnScrollContext);
        const dragScrollContext = React.useContext(DragScrollContext);

        const shouldAddAccelerationOnRoot =
            columnScrollContext.isMobile || !dragScrollContext.isOverlayShown;

        const [shouldUseFakeRender, setShouldUseFakeRender] = React.useState(
            props.collection.getColumnScrollStartPosition() === 'end'
        );

        React.useEffect(() => {
            if (shouldUseFakeRender && columnScrollContext.isNeedByWidth) {
                setShouldUseFakeRender(false);
            }
        }, [columnScrollContext.isNeedByWidth]);

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
