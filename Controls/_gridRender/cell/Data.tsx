/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { IDataCellComponentProps } from './interface/IDataCellComponent';
import getMarker from './utils/Renders/GetMarker';
import getTag from './utils/Renders/GetTag';
import { default as BaseCell } from './Base';
import { getBaseCellProps } from 'Controls/_gridRender/cell/utils/Base';
import {
    IHorizontalSeparatorsConfig,
    IVerticalSeparatorsConfig,
} from 'Controls/_gridRender/cell/interface/ICell';
import { EditArrowComponent } from 'Controls/listsCommonLogic';
import Actions from 'Controls/_gridRender/components/Actions';
import { getColspanRowspanStyles } from './utils/Styles/GridSpan';
import { getFontClasses } from './utils/Classes/Font';
import { getBorderClasses, getBorderRadiusClasses } from './utils/Classes/Border';
import { getCellPositionClasses } from 'Controls/_gridRender/cell/utils/Classes/CellPosition';
import { getDisplayTypeClasses } from 'Controls/_gridRender/cell/utils/Classes/DisplayType';
import {
    getBackgroundColorStyleClasses,
    getHoverBackgroundColorStyleClasses,
} from 'Controls/_gridRender/cell/utils/Classes/BackgroundColorStyle';
import {
    getHorizontalMarginsClasses,
    getHorizontalPaddingsClasses,
    getVerticalPaddingsClasses,
} from 'Controls/_gridRender/cell/utils/Classes/Offset';
import { getRowSeparatorClasses } from 'Controls/_gridRender/cell/utils/Classes/RowSeparator';
import { getColumnSeparatorClasses } from 'Controls/_gridRender/cell/utils/Classes/ColumnSeparator';
import { getAlignClasses, getVAlignClasses } from 'Controls/_gridRender/cell/utils/Classes/Align';
import { getBaselineClasses } from 'Controls/_gridRender/cell/utils/Classes/Baseline';
import { getShadowClasses } from 'Controls/_gridRender/cell/utils/Classes/Shadow';
import { getEditingClasses } from 'Controls/_gridRender/cell/utils/Classes/Editing';
import { getLadderClasses } from 'Controls/_gridRender/cell/utils/Classes/Ladder';
import getVisualComponent from '../utils/getVisualComponent';

// wrapper render utils
function getStyles(props: IDataCellComponentProps): React.CSSProperties {
    return { ...props.style, ...getColspanRowspanStyles(props) };
}

function getBaseClasses(
    props: Pick<
        IDataCellComponentProps,
        | 'className'
        | 'minHeightClassName'
        | 'isDragged'
        | 'fadedClass'
        | 'editing'
        | 'hoverMode'
        | 'cursor'
        | 'colspan'
        | 'decorationStyle'
        | 'isSticky'
        | 'actionsVisibility'
        | 'cellUnderline'
        | 'isHasStickyProperty'
        | 'isHiddenForLadder'
        | 'paddingTop'
        | 'paddingBottom'
    >
) {
    let baseClasses =
        'controls-GridReact__cell' +
        ' js-controls-GridReact__cell' +
        ' js-controls-Grid__row-cell' +
        ' js-controls-ListView__editingTarget' +
        ' controls-ListView__item_contentWrapper' +
        // Класс, необходимый для измерений ширины, взятия фона ячейки и т.д.
        ' js-controls-ListView__measurableContainer';

    // className from props
    if (props.className) {
        baseClasses += ` ${props.className}`;
    }

    // decorationStyle classes
    if (props.decorationStyle) {
        baseClasses += ` controls-GridReact__cell-${props.decorationStyle}`;
    }

    // cursor classes
    baseClasses += ` tw-cursor-${props.cursor}`;

    // min-height classes
    if (props.minHeightClassName) {
        baseClasses += ` ${props.minHeightClassName}`;
    }

    // Если запись может стикаться, то не нужно задавать position: relative, т.к. этим мы перебьем position: sticky
    if (!props.isSticky) {
        baseClasses += ' tw-relative';
    }

    // dragNDrop classes
    if (props.isDragged) {
        baseClasses += ' controls-ListView__item_dragging';
    }

    if (props.fadedClass) {
        baseClasses += ` ${props.fadedClass}`;
    }

    // edit in place classes
    if (props.editing) {
        baseClasses += ' controls-Grid__row-cell-editing';
    }

    // hoverMode classes
    if (props.hoverMode) {
        baseClasses += ` controls-GridReact__cell__hoverMode_${props.hoverMode}`;
    }

    // colspan classes
    // TODO: use startColspanIndex/endColspanIndex
    if (props.colspan && props.colspan > 1) {
        baseClasses += ' js-controls-Grid__cell_colspaned';
    }

    // itemActions classes
    if (props.actionsVisibility && props.actionsVisibility !== 'hidden') {
        baseClasses += ' controls-GridReact__cell_actionsCell';
    }

    // underline classes
    if (props.cellUnderline) {
        baseClasses += ' controls-GridReact__cell-underline';
    }

    // ladder classes
    if (props.isHasStickyProperty && props.isHiddenForLadder) {
        baseClasses += ' controls-Grid__ladder_sticky_z_index_cell';
    }

    return baseClasses;
}

function getMarkerClasses(
    props: Pick<IDataCellComponentProps, 'isMarked' | 'backgroundColorStyle'>
) {
    if (!props.isMarked) {
        return '';
    }

    if (props.backgroundColorStyle === 'master_selected') {
        return ' controls-Grid__row-cell_selected-master';
    }

    return ` controls-Grid__row-cell_selected-${props.backgroundColorStyle}`;
}

function getSeparatorClasses(
    props: Pick<
        IDataCellComponentProps,
        'isStickyLadderCell' | keyof IVerticalSeparatorsConfig | keyof IHorizontalSeparatorsConfig
    >
) {
    if (props.isStickyLadderCell) {
        return '';
    }

    return (
        getRowSeparatorClasses({
            topSeparatorSize: props.topSeparatorSize,
            topSeparatorStyle: props.topSeparatorStyle,
            bottomSeparatorSize: props.bottomSeparatorSize,
            bottomSeparatorStyle: props.bottomSeparatorStyle,
        }) +
        getColumnSeparatorClasses({
            leftSeparatorSize: props.leftSeparatorSize,
            rightSeparatorSize: props.rightSeparatorSize,
        })
    );
}

// content render utils
function getDataContentRender(
    props: Pick<IDataCellComponentProps, 'contentRender' | 'render'>
): React.ReactElement | null {
    const { contentRender } = props;

    // Если задан рендер контента, то используем его
    if (contentRender) {
        return contentRender;
    }

    // todo удалить, временно для работы рендеров
    if (props.render) {
        return props.render;
    }

    return null;
}

// data cell component
function Data(
    props: IDataCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperRenderClassName =
        getBaseClasses(props) +
        getMarkerClasses(props) +
        getFontClasses(props) +
        getBorderRadiusClasses(props) +
        getBorderClasses(props) +
        getCellPositionClasses(props) +
        getDisplayTypeClasses(props.displayType) +
        getBackgroundColorStyleClasses(
            props.backgroundColorStyle || props.backgroundStyle,
            props.isSticky
        ) +
        getHoverBackgroundColorStyleClasses(props) +
        getAlignClasses(props.halign) +
        getVAlignClasses(props.valign) +
        getShadowClasses(props) +
        getBaselineClasses(props.valign, props.minHeight, props.baseline) +
        getVerticalPaddingsClasses(props.paddingTop, props.paddingBottom) +
        getHorizontalPaddingsClasses(props.paddingLeft, props.paddingRight) +
        getHorizontalMarginsClasses(
            props.marginLeft,
            props.marginRight,
            props.isFirstCell,
            props.isLastCell
        ) +
        getSeparatorClasses(props) +
        getLadderClasses(props) +
        getEditingClasses(props);

    const wrapperRenderStyle = getStyles(props);

    const beforeContentRender = props.beforeContentRender
        ? React.cloneElement(props.beforeContentRender, { ...props, children: undefined })
        : null;

    const afterContentRender = props.afterContentRender
        ? React.cloneElement(props.afterContentRender, { ...props, children: undefined })
        : null;

    const markerRender = props.markerVisible ? getMarker(props) : null;

    const editArrowRender = props.editArrowVisible ? (
        <EditArrowComponent backgroundStyle={props.hoverBackgroundStyle} />
    ) : null;

    const actionsRender = (
        <Actions
            actionsVisibility={props.actionsVisibility}
            actionsPosition={props.actionsPosition}
            actionHandlers={props.actionHandlers}
            hoverBackgroundStyle={props.hoverBackgroundStyle}
            highlightOnHover={props.highlightOnHover}
            backgroundStyle={props.backgroundColorStyle}
            actionsClassName={props.actionsClassName}
        />
    );

    const tagRender = props.tagStyle ? getTag(props) : null;

    const DCT = props.draggingItemsCount && getVisualComponent('DraggingCounterTemplate');
    const draggingCounterRender = DCT ? <DCT itemsCount={props.draggingItemsCount} /> : null;

    const contentRender = (
        <>
            {markerRender}
            {beforeContentRender}
            {getDataContentRender(props)}
            {afterContentRender}
            {editArrowRender}
            {actionsRender}
            {tagRender}
            {draggingCounterRender}
        </>
    );

    return (
        <BaseCell
            {...getBaseCellProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={props.tooltip}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(Data);
