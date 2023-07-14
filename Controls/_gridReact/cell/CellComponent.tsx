import * as React from 'react';

import { DraggingCounterTemplate } from 'Controls/baseList';
import { default as Marker } from 'Controls/markerComponent';
import { StickyGroupedBlock } from 'Controls/stickyBlock';
import { TGridVPaddingSize } from 'Controls/interface';

import { ICellComponentProps } from './interface';
import ActionsWrapper from '../components/ActionsWrapper';
import TagTemplate from 'Controls/Application/TagTemplate/TagTemplateReact';
import { EditArrowComponent } from 'Controls/grid';

const DEFAULT_PROPS: Partial<ICellComponentProps> = {
    paddingLeft: 'grid_m',
    paddingRight: 'grid_m',

    hoverBackgroundStyle: 'list_default',
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

function getClassName({
    isFirstCell,
    isLastCell,
    fontSize,
    fontColorStyle,
    fontWeight,
    cursor = 'pointer',
    paddingTop,
    paddingBottom,
    paddingLeft = DEFAULT_PROPS.paddingLeft,
    paddingRight = DEFAULT_PROPS.paddingRight,
    hoverBackgroundStyle = DEFAULT_PROPS.hoverBackgroundStyle,
    backgroundStyle,
    halign,
    valign = 'baseline',
    className: propsClassName,
    displayType = 'flex',
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
}: ICellComponentProps): string {
    let className = 'controls-GridReact__cell';
    className += ' js-controls-Grid__row-cell';

    if (displayType) {
        className += ` tw-${displayType}`;
    }

    if (isFirstCell) {
        className += ' controls-GridReact__cell_first';
    }

    if (isLastCell) {
        className += ' controls-GridReact__cell_last';
    }

    // Если запись может стикаться, то не нужно задавать position: relative, т.к. этим мы перебьем position: sticky
    if (!stickied) {
        className += ' tw-relative';
    }

    if (minHeightClassName) {
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
    if (hoverBackgroundStyle && hoverBackgroundStyle !== 'none') {
        className += ` controls-hover-background-${hoverBackgroundStyle}`;
    }

    if (halign) {
        className += ` tw-justify-${halign}`;
    }
    if (valign) {
        className += ` tw-items-${valign}`;
        if (valign === 'baseline') {
            // Добавляем для выравнивания псевдосимвол в 17px
            className += ' controls-GridReact__cell-baseline';
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
        className += ` controls-GridReact__cell-border_${borderVisibility}`;
        className += ` controls-GridReact__cell-borderStyle_${borderStyle}`;
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

    if (editable) {
        className += ' js-controls-ListView__editingTarget';
    }

    return className;
}

function getStyles(props: ICellComponentProps): React.CSSProperties {
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

function CellComponent(props: ICellComponentProps): React.ReactElement {
    const hoverBackgroundStyle = props.hoverBackgroundStyle ?? DEFAULT_PROPS.hoverBackgroundStyle;
    const marker = props.markerVisible && (
        <Marker markerSize={props.markerSize} className={props.markerClassName} />
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
        <div
            className={`js-controls-tag controls-Grid__cell_tag controls-Grid__cell_tag_position_${props.tagPosition}`}
        >
            <TagTemplate tagStyle={props.tagStyle} />
        </div>
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
            >
                {content}
            </StickyGroupedBlock>
        );
    }

    return (
        <div
            {...props.attributes}
            className={className}
            style={style}
            title={title}
            data-qa={'cell'}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
        >
            {content}
        </div>
    );
}

export default React.memo(CellComponent);
