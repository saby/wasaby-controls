import * as React from 'react';

import { DraggingCounterTemplate } from 'Controls/baseList';
import { default as Marker } from 'Controls/markerComponent';
import { getBorderClassName } from 'Controls/display';

import { ICellComponentProps } from './interface';
import ActionsWrapper from '../components/ActionsWrapper';
import TagTemplate from 'Controls/Application/TagTemplate/TagTemplateReact';

const DEFAULT_PROPS: Partial<ICellComponentProps> = {
    paddingTop: 'grid_s',
    paddingBottom: 'grid_s',
    paddingLeft: 'grid_m',
    paddingRight: 'grid_m',

    hoverBackgroundStyle: 'list_default',
};

function getClassName({
    isFirstCell,
    isLastCell,
    fontSize,
    fontColorStyle,
    fontWeight,
    cursor = 'pointer',
    paddingTop = DEFAULT_PROPS.paddingTop,
    paddingBottom = DEFAULT_PROPS.paddingBottom,
    paddingLeft = DEFAULT_PROPS.paddingLeft,
    paddingRight = DEFAULT_PROPS.paddingRight,
    hoverBackgroundStyle = DEFAULT_PROPS.hoverBackgroundStyle,
    backgroundColorStyle,
    halign,
    valign = 'baseline',
    className: propsClassName,
    borderVisibility = 'hidden',
    borderStyle = 'default',
    shadowVisibility = 'hidden',
    editable = false,
    editing = false,
    minHeightClassName,
    textOverflow = 'none',
}: ICellComponentProps): string {
    let className = 'controls-GridReact__cell tw-flex tw-relative';
    className += ' js-controls-Grid__row-cell';

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

    if (paddingTop && paddingTop !== 'null') {
        className += ` controls-padding_top-${paddingTop}`;
    }
    if (paddingBottom && paddingBottom !== 'null') {
        className += ` controls-padding_bottom-${paddingBottom}`;
    }
    if (paddingLeft && paddingLeft !== 'null') {
        className += ` controls-padding_left-${paddingLeft}`;
    }
    if (paddingRight && paddingRight !== 'null') {
        className += ` controls-padding_right-${paddingRight}`;
    }

    if (backgroundColorStyle && backgroundColorStyle !== 'none') {
        className += ` controls-background-${backgroundColorStyle}`;
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

    className += getBorderClassName(
        borderVisibility,
        borderStyle,
        isFirstCell,
        isLastCell
    );

    if (shadowVisibility !== 'hidden') {
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

    if (textOverflow) {
        if (textOverflow === 'none') {
            className += ' tw-break-words';
        } else if (textOverflow === 'ellipsis') {
            className += ' tw-truncate';
        }
    }

    return className;
}

function getStyles(props: ICellComponentProps): React.CSSProperties {
    const styles: React.CSSProperties = {};
    if (props.startColspanIndex !== undefined) {
        const endIndex =
            !!props.cCount && props.isLastCell ? '-1' : props.endColspanIndex;
        styles.gridColumn = `${props.startColspanIndex} / ${endIndex}`;
    }
    if (props.startRowspanIndex !== undefined) {
        styles.gridRow = `${props.startRowspanIndex} / ${props.endRowspanIndex}`;
    }
    return styles;
}

function CellComponent(props: ICellComponentProps): React.ReactElement {
    const marker = props.markerVisible && (
        <Marker
            markerSize={props.markerSize}
            className={props.markerClassName}
        />
    );
    const actions = props.actionsVisibility !== 'hidden' && (
        <ActionsWrapper
            actionsVisibility={props.actionsVisibility}
            actionHandlers={props.actionHandlers}
            hoverBackgroundStyle={props.hoverBackgroundStyle}
            actionsClassName={props.actionsClassName}
        />
    );
    const title =
        props.tooltip !== undefined && props.tooltip !== ''
            ? props.tooltip
            : null;

    const draggingCounter = props.draggingItemsCount &&
        <DraggingCounterTemplate itemsCount={props.draggingItemsCount}/>;
   const tag = props.tagStyle &&
       <div className={'js-controls-tag controls-Grid__cell_tag controls-Grid__cell_tag_position_content'}>
          <TagTemplate tagStyle={props.tagStyle}/>
       </div>;

    return (
        <div
            className={getClassName(props)}
            style={getStyles(props)}
            title={title}
        >
            {marker}
            {props.render}
            {tag}
            {actions}
            {draggingCounter}
        </div>
    );
}

export default React.memo(CellComponent);
