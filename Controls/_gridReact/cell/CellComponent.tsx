import * as React from 'react';
import { Logger } from 'UICommon/Utils';

import { DraggingCounterTemplate } from 'Controls/baseList';
import { default as Marker } from 'Controls/markerComponent';
import { StickyGroupedBlock } from 'Controls/stickyBlock';
import { TGridVPaddingSize } from 'Controls/interface';

import { ICellComponentProps } from './interface';
import ActionsWrapper from '../components/ActionsWrapper';
import { EditArrowComponent } from 'Controls/listVisualAspects';
import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';

const DEFAULT_PROPS: Partial<ICellComponentProps> = {
    hoverBackgroundStyle: 'default',
};

export function getVerticalPaddingsClassName(
    paddingTop?: TGridVPaddingSize,
    paddingBottom?: TGridVPaddingSize
): string {
    let className = '';
    if (paddingTop && paddingTop !== 'null') {
        className += ` controls-padding_top-${paddingTop}`;
    }
    if (paddingBottom && paddingBottom !== 'null') {
        className += ` controls-padding_bottom-${paddingBottom}`;
    }
    return className;
}

export function getClassName({
    isFirstCell,
    isHasStickyProperty,
    isStickyLadderCell,
    isLastCell,
    fontSize,
    fontColorStyle,
    fontWeight,
    cursor = 'pointer',
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    hoverBackgroundStyle = DEFAULT_PROPS.hoverBackgroundStyle,
    backgroundStyle,
    halign,
    valign = 'baseline',
    baseline = 'default',
    className: propsClassName,
    displayType = 'flex',
    borderMode,
    borderVisibility = 'hidden',
    borderStyle = 'default',
    shadowVisibility = 'hidden',
    editable,
    editing,
    minHeightClassName,
    stickied,
    topSeparatorSize,
    bottomSeparatorSize,
    topSeparatorStyle,
    bottomSeparatorStyle,
    leftSeparatorSize,
    rightSeparatorSize,
    hoverMode,
    actionsVisibility,
    topLeftBorderRadius,
    topRightBorderRadius,
    bottomRightBorderRadius,
    bottomLeftBorderRadius,
    minHeight,
    highlightOnHover,
    isMarked,
}: ICellComponentProps): string {
    let className = 'controls-GridReact__cell ';

    if (isFirstCell && isHasStickyProperty) {
        minHeight = 'null';
        if (!isStickyLadderCell) {
            className = 'controls-Grid__ladder_sticky_z_index_cell ';
        }
    }

    className += ' js-controls-Grid__row-cell';

    className += ` controls-GridReact__cell__hoverMode_${hoverMode}`;

    className += ' js-controls-ListView__editingTarget';

    if (displayType) {
        className += ` tw-${displayType}`;
    }

    if (isFirstCell) {
        className += ' controls-GridReact__cell_first';
    }

    if (isLastCell) {
        className += ' controls-GridReact__cell_last';
    }

    if (actionsVisibility && actionsVisibility !== 'hidden') {
        className += ' controls-GridReact__cell_actionsCell';
    }

    // Если запись может стикаться, то не нужно задавать position: relative, т.к. этим мы перебьем position: sticky
    if (!stickied) {
        className += ' tw-relative';
    }

    if (minHeightClassName && minHeight !== 'null') {
        className += ` ${minHeightClassName}`;
    }

    if (propsClassName) {
        className += ` ${propsClassName}`;
    }

    if (fontSize) {
        className += ` controls-fontsize-${fontSize}`;
    }
    if (fontWeight) {
        className += ` controls-fontweight-${fontWeight}`;
    }
    if (fontColorStyle) {
        className += ` controls-text-${fontColorStyle}`;
    }

    if (cursor) {
        className += ` tw-cursor-${cursor}`;
    }

    if (topLeftBorderRadius) {
        className += ` controls-ListView__item_roundBorder_topLeft_${topLeftBorderRadius}`;
    }
    if (topRightBorderRadius) {
        className += ` controls-ListView__item_roundBorder_topRight_${topRightBorderRadius}`;
    }
    if (bottomRightBorderRadius) {
        className += ` controls-ListView__item_roundBorder_bottomRight_${bottomRightBorderRadius}`;
    }
    if (bottomLeftBorderRadius) {
        className += ` controls-ListView__item_roundBorder_bottomLeft_${bottomLeftBorderRadius}`;
    }

    const verticalPaddingClassName = getVerticalPaddingsClassName(paddingTop, paddingBottom);
    if (verticalPaddingClassName) {
        className += ` ${verticalPaddingClassName}`;
    }
    if (paddingLeft && paddingLeft !== 'null') {
        className += ` controls-padding_left-${paddingLeft}`;
    }
    if (paddingRight && paddingRight !== 'null') {
        className += ` controls-padding_right-${paddingRight}`;
    }

    if (backgroundStyle && backgroundStyle !== 'none') {
        className += ` controls-background-${backgroundStyle}`;
    }
    if (hoverBackgroundStyle && hoverBackgroundStyle !== 'none' && highlightOnHover !== false) {
        className += ` controls-hover-background-${hoverBackgroundStyle}`;
        if (isMarked) {
            className += ` controls-Grid__row-cell_selected-${hoverBackgroundStyle}`;
        }
    }

    if (halign) {
        className += ` tw-justify-${halign} `;
        if (halign === 'end') {
            className += ' tw-text-end';
        }
        if (halign === 'center') {
            className += ' tw-text-center';
        }
        if (halign === 'start') {
            className += ' tw-text-start';
        }
    }

    if (valign) {
        className += ` tw-items-${valign}`;
        if (valign === 'baseline') {
            className += ' controls-GridReact__cell-baseline';
            if (minHeight !== 'null') {
                className += ` controls-GridReact__cell-baseline_${baseline}`;
            }
        }
    }

    if (topSeparatorSize && topSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_topSeparatorSize-${topSeparatorSize}`;
        if (topSeparatorStyle) {
            className += ` controls-GridReact-cell_topSeparatorSize_style-${topSeparatorStyle}`;
        }
    }

    if (bottomSeparatorSize && bottomSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_bottomSeparatorSize-${bottomSeparatorSize}`;
        if (bottomSeparatorStyle) {
            className += ` controls-GridReact-cell_bottomSeparatorSize_style-${bottomSeparatorStyle}`;
        }
    }

    if (leftSeparatorSize && leftSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_leftSeparatorSize-${leftSeparatorSize}`;
    }

    if (rightSeparatorSize && rightSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_rightSeparatorSize-${rightSeparatorSize}`;
    }

    if (borderVisibility && borderVisibility !== 'hidden') {
        if (!borderMode) {
            Logger.error('Не указан borderMode на CellComponent.');
        }

        className += ` controls-GridReact__cell-border_${borderMode}_${borderVisibility}`;
        className += ` controls-GridReact__cell-borderStyle_${borderStyle}`;
        if (borderMode === 'row') {
            if (isFirstCell) {
                className += ' controls-GridReact__cell-border_row_first';
            }
            if (isLastCell) {
                className += ' controls-GridReact__cell-border_row_last';
            }
        }
    }

    if (shadowVisibility && shadowVisibility !== 'hidden') {
        className += ` controls-ListView__item_shadow_${shadowVisibility}`;
        if (isFirstCell) {
            className += ' controls-GridReact__first-cell_shadow-mask';
        }
        if (isLastCell) {
            className += ' controls-GridReact__last-cell_shadow-mask';
        }
        if (!isFirstCell && !isLastCell) {
            className += ' controls-GridReact__cell_shadow-mask';
        }
    }

    if (editing) {
        className += ' controls-Grid__row-cell-editing';
    }

    // Класс, необходимый для измерений ширины, взятия фона ячейки и тд.
    className += ' js-controls-ListView__measurableContainer';

    return className;
}

export function getStyles(props: ICellComponentProps): React.CSSProperties {
    const styles: React.CSSProperties = { ...props.style };
    if (props.startColspanIndex !== undefined) {
        const endIndex =
            // @ts-ignore
            !!props.cCount && props.isLastCell ? '-1' : props.endColspanIndex;
        styles.gridColumn = `${props.startColspanIndex} / ${endIndex || 'auto'}`;
    }
    if (props.startRowspanIndex !== undefined) {
        styles.gridRow = `${props.startRowspanIndex} / ${props.endRowspanIndex || 'auto'}`;
    }
    return styles;
}

function getMarkerClassName(
    markerClassName: string,
    markerPosition: 'default' | 'custom' = 'default'
) {
    let className = markerClassName;
    if (markerPosition === 'default') {
        className += ' controls-GridReact__cell-marker_default';
    }
    // На маркер вешаем выравнивание по базовой линии, т.к. он расположен абсолютно и
    // не выравнивается от грида.
    className += ' controls-GridReact__cell-baseline_default';
    return className;
}

function CellComponent(props: ICellComponentProps): React.ReactElement {
    const hoverBackgroundStyle = props.hoverBackgroundStyle ?? DEFAULT_PROPS.hoverBackgroundStyle;
    const marker = props.markerVisible && props.marker && (
        <Marker
            markerSize={props.markerSize}
            className={getMarkerClassName(props.markerClassName, props.markerPosition)}
        />
    );
    const actions = props.actionsVisibility && props.actionsVisibility !== 'hidden' && (
        <ActionsWrapper
            actionsVisibility={props.actionsVisibility}
            actionHandlers={props.actionHandlers}
            hoverBackgroundStyle={hoverBackgroundStyle}
            actionsClassName={props.actionsClassName}
        />
    );
    const draggingCounter = props.draggingItemsCount && (
        <DraggingCounterTemplate itemsCount={props.draggingItemsCount} />
    );
    const tag = props.tagStyle && (
        <TagTemplateReact
            tagStyle={props.tagStyle}
            position={props.tagPosition === 'border' ? 'topRight' : 'custom'}
            className={
                'js-controls-tag ' +
                (props.tagPosition === 'content'
                    ? 'controls-Grid__cell_tag_position_content '
                    : '') +
                (props.tagClassName || '')
            }
        />
    );
    const editArrow = props.showEditArrow && (
        <EditArrowComponent backgroundStyle={props.hoverBackgroundStyle} />
    );

    const content = (
        <>
            {marker}
            {props.render}
            {editArrow}
            {tag}
            {actions}
            {draggingCounter}
        </>
    );

    const className = getClassName(props);
    const style = getStyles(props);
    const title = props.tooltip !== undefined && props.tooltip !== '' ? props.tooltip : null;

    if (props.stickied) {
        return (
            <StickyGroupedBlock
                className={className}
                position={props.stickyPosition}
                mode={props.stickyMode}
                zIndex={null}
                fixedZIndex={null}
                backgroundStyle={props.stickiedBackgroundStyle}
                shadowVisibility={props.shadowVisibility}
                attrs={{
                    style,
                    title,
                    'data-qa': 'cell',
                }}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseMove={props.onMouseMove}
            >
                {content}
            </StickyGroupedBlock>
        );
    }

    return (
        <div
            {...props.attributes}
            className={className}
            tabIndex={props.tabIndex}
            style={style}
            title={title}
            data-qa={props.attributes?.['data-qa'] || 'cell'}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseMove={props.onMouseMove}
        >
            {content}
        </div>
    );
}

export default React.memo(CellComponent);
