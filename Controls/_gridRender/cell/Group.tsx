/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import type { IBaseGroupTemplate } from 'Controls/baseList';
import BaseCell, { IBaseCellComponentProps } from 'Controls/_gridRender/cell/Base';
import { getBaseCellProps } from 'Controls/_gridRender/cell/utils/Base';
import GroupContentRender from 'Controls/_gridRender/cell/content/Group';
import {
    getBackgroundColorStyleClasses,
    getHoverBackgroundColorStyleClasses,
} from 'Controls/_gridRender/cell/utils/Classes/BackgroundColorStyle';
import { getColumnScrollClasses } from 'Controls/_gridRender/cell/utils/Classes/ColumnScroll';
import { TCellType } from 'Controls/_gridRender/cell/interface/ICell';
import { ICellPositionProps, TBackgroundStyle, TCursor } from 'Controls/interface';
import {
    getHorizontalPaddingsClasses,
    getVerticalPaddingsClasses,
} from 'Controls/_gridRender/cell/utils/Classes/Offset';
import { TPadding } from 'Controls/_gridRender/cell/utils/Props/Padding';
import { getCellPositionClasses } from 'Controls/_gridRender/cell/utils/Classes/CellPosition';

export interface IGroupCellComponentProps
    extends IBaseCellComponentProps,
        IBaseGroupTemplate,
        ICellPositionProps {
    customTemplateProps?: object;
    expanded?: boolean;
    expanderPosition?: string;
    rightTemplateProps?: object;
    textRender?: string | React.ReactElement;

    // sticky
    headerFixedPosition?: string;

    // Должно уйти в будущем, для этого надо поправить компонент группировки
    decorationStyle?: string; // default или master
    isFirstItem?: boolean;
    rightTemplateCondition?: boolean;
    // Растягивание шаблона справа.  Применяется в гриде при скролле колонок
    rightTemplateStretch?: boolean;

    // colspan
    startColumn?: number; // ?
    endColumn?: number;

    // тип ячейки
    cellType?: TCellType;

    // Флаг скрытого заголовка группы
    isHiddenGroup?: boolean;

    isFirstDataColumn?: boolean;

    isGroupNode?: boolean;

    // hover
    hoverBackgroundStyle?: TBackgroundStyle;
    highlightOnHover?: boolean;
    isStickyLadderCell?: boolean;

    // cursor
    cursor?: TCursor;

    // first last cell
    isFirstCell?: boolean;
    isLastCell?: boolean;

    // Padding
    padding?: TPadding;
}

function getStyle(
    props: Pick<IGroupCellComponentProps, 'style' | 'startColumn' | 'endColumn'>
): React.CSSProperties | undefined {
    const { startColumn, endColumn } = props;
    if (startColumn && endColumn) {
        return {
            ...props.style,
            gridColumn: `${startColumn} / ${endColumn}`,
        };
    }
    return {
        ...props.style,
    };
}

function getBaseClasses(): string {
    // controls-ListView__groupContent_height в groupContentRender
    return 'controls-GridReact__cell js-controls-GridReact__cell js-controls-Grid__row-cell tw-flex tw-box-border';
}

function getCursorClasses(cursor: TCursor = 'pointer') {
    return ` tw-cursor-${cursor}`;
}

function getAlignClasses() {
    return ' tw-items-center';
}

function getPaddingClasses(props: IGroupCellComponentProps) {
    const hasRightTemplate = !!props.rightTemplate && props.rightTemplateCondition !== false;
    const [, leftPaddingClassName, rightPaddingClassName] = getHorizontalPaddingsClasses(
        props.padding?.left,
        props.padding?.right
    ).split(' ');
    let paddingClasses = getVerticalPaddingsClasses(props.padding?.top, props.padding?.bottom);

    // Отступ слева нужен:
    // 1) Узел ввиде группы - isGroupNode
    // 2) Если первая ячейка обычной группировки - isFirstCell

    if (props.isFirstCell || props.isGroupNode) {
        paddingClasses += ' ' + leftPaddingClassName;
    }

    // Отступ справа нужен:
    // 1) Если узел ввиде группы - isGroupNode
    // 2) Если последняя ячейка обычной группировки - isLastCell

    if (!hasRightTemplate && (props.isGroupNode || props.isLastCell)) {
        paddingClasses += ' ' + rightPaddingClassName;
    }

    return paddingClasses;
}

function getCheckboxClasses(
    cellType: IGroupCellComponentProps['cellType'],
    decorationStyle: IGroupCellComponentProps['decorationStyle']
) {
    if (cellType === 'checkbox') {
        return ` controls-Grid__row-cell-checkbox-${decorationStyle}`;
    }
    return '';
}

function getGroupContentWrapperClasses(
    isFirstCell: ICellPositionProps['isFirstCell'],
    isLastCell: ICellPositionProps['isLastCell']
): string {
    let classes = ' controls-ListView__GroupContentWrapper';

    if (isFirstCell) {
        classes += ' controls-ListView__GroupContentWrapper_first';
    }
    if (isLastCell) {
        classes += ' controls-ListView__GroupContentWrapper_last';
    }

    return classes;
}

/**
 * Рендер контента заголовка группы.
 * @param props
 */
function getContentRender(props: IGroupCellComponentProps): React.ReactElement | null {
    if (props.isHiddenGroup) {
        return null;
    }
    return (
        <GroupContentRender
            backgroundStyle={props.backgroundStyle}
            contentRender={props.contentRender}
            customTemplateProps={props.customTemplateProps}
            decorationStyle={props.decorationStyle}
            expanded={props.expanded}
            expanderPosition={props.expanderPosition}
            expanderVisible={props.expanderVisible}
            fontColorStyle={props.fontColorStyle}
            fontSize={props.fontSize}
            fontWeight={props.fontWeight}
            halign={props.halign}
            headerFixedPosition={props.headerFixedPosition}
            iconSize={props.iconSize}
            iconStyle={props.iconStyle}
            isFirstItem={props.isFirstItem}
            isSticky={props.isSticky}
            padding={props.padding}
            rightTemplate={props.rightTemplate}
            rightTemplateCondition={props.rightTemplateCondition}
            rightTemplateProps={props.rightTemplateProps}
            rightTemplateStretch={props.rightTemplateStretch}
            separatorVisible={props.separatorVisible}
            textRender={props.textRender}
            textTransform={props.textTransform}
            textVisible={props.textVisible}
            className={props.className}
        />
    );
}

export function getWrapperRenderClassName(props: IGroupCellComponentProps): string {
    let className =
        getBaseClasses() +
        getCellPositionClasses(props) +
        getAlignClasses() +
        getCursorClasses(props.cursor) +
        getPaddingClasses(props) +
        getColumnScrollClasses(props) +
        getCheckboxClasses(props.cellType, props.decorationStyle) +
        getHoverBackgroundColorStyleClasses({
            hoverBackgroundStyle: props.hoverBackgroundStyle,
            highlightOnHover: props.highlightOnHover,
            isStickyLadderCell: props.isStickyLadderCell,
        }) +
        getGroupContentWrapperClasses(props.isFirstCell, props.isLastCell);

    if (!props.isSticky) {
        className += getBackgroundColorStyleClasses(props.backgroundStyle);
    }

    return className;
}

/**
 * Рендер ячейки, содержащей заголовок группы
 * @param props
 * @param ref
 * @constructor
 */
function Group(
    props: IGroupCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperRenderClassName = getWrapperRenderClassName(props);

    const wrapperRenderStyle = getStyle(props);

    const contentRender = getContentRender(props);

    return (
        <BaseCell
            {...getBaseCellProps(props)}
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

export default React.forwardRef(Group);
