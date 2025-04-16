import * as React from 'react';
import {
    IGroupCellComponentProps,
    BaseCellComponent,
    getGroupCellComponentWrapperRenderClassName,
    getGroupContentTextStylingClasses,
    BaseCellRenderUtils,
    AlignClassUtils,
    templateLoader,
    ActionsWrapper,
} from 'Controls/gridRender';
import { TItemActionsPosition, TItemActionsVisibility } from 'Controls/interface';
import { IItemActionsHandler } from 'Controls/baseList';

export interface IHierarchyGroupDataCellComponentProps extends IGroupCellComponentProps {
    // itemactions
    actionHandlers: IItemActionsHandler;
    actionsVisibility: TItemActionsVisibility;
    actionsPosition: TItemActionsPosition;
    actionsClassName: string;
}

function getStyle(
    props: Pick<IHierarchyGroupDataCellComponentProps, 'style' | 'startColumn' | 'endColumn'>
): React.CSSProperties | undefined {
    const { startColumn, endColumn } = props;
    if (startColumn && endColumn) {
        return {
            ...props.style,
            gridColumn: `${startColumn} / ${endColumn}`,
        };
    }
    return props.style;
}

function getActionsVisibilityClasses(
    actionsVisibility: IHierarchyGroupDataCellComponentProps['actionsVisibility']
): string {
    return actionsVisibility && actionsVisibility !== 'hidden'
        ? ' controls-GridReact__cell_actionsCell'
        : '';
}

function getContentRender(props: IHierarchyGroupDataCellComponentProps): React.ReactElement {
    //  Контент ячейки данных в строке с группой должен рендериться внутри ячейки с выравниванием по центру,
    //  но сам должен выравниваться по базовой линии.
    //  В старом гриде рендер происходил с доп слоем cell_content, теперь этого слоя нет
    let contentRenderClassName = ' tw-items-baseline controls-GridReact__cell-baseline';
    if (props.minHeight !== 'null' && props.baseline) {
        contentRenderClassName += ` controls-GridReact__cell-baseline_${props.baseline}`;
    }
    return templateLoader(props.contentRender, {
        className: contentRenderClassName,
    });
}

/**
 * Рендер ячейки данных (итогов и др) в строке иерархической группировки
 * @param props
 * @constructor
 */
function HierarchyGroup(
    props: IHierarchyGroupDataCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperRenderClassName =
        getGroupCellComponentWrapperRenderClassName(props) +
        getGroupContentTextStylingClasses(
            props.fontColorStyle,
            props.fontSize,
            props.fontWeight,
            props.textTransform
        ) +
        AlignClassUtils.getAlignClasses(props.halign) +
        getActionsVisibilityClasses(props.actionsVisibility);

    const wrapperRenderStyle = getStyle(props);

    const itemActionsRender = props.isLastCell ? (
        <ActionsWrapper
            actionsVisibility={props.actionsVisibility}
            actionHandlers={props.actionHandlers}
            hoverBackgroundStyle={props.hoverBackgroundStyle}
            backgroundStyle={props.backgroundStyle}
            actionsClassName={props.actionsClassName}
            highlightOnHover={props.highlightOnHover}
            actionsPosition={props.actionsPosition}
        />
    ) : null;

    const contentRender = (
        <>
            {getContentRender(props)}
            {itemActionsRender}
        </>
    );

    return (
        <BaseCellComponent
            {...BaseCellRenderUtils.getBaseCellProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            contentRender={contentRender}
            data-qa={'cell'}
            style={wrapperRenderStyle}
            tabIndex={props.tabIndex}
            fixedZIndex={props.fixedZIndex}
            tooltip={undefined}
            onMouseEnter={undefined}
            onMouseMove={undefined}
            isSticky={props.isSticky || props.stickied} // Правильно isSticky, stickied - исп. в CellComponent
        />
    );
}

export default React.memo(React.forwardRef(HierarchyGroup));
