/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*
 * Файл содержит компонент ячейки и вспомогательные методы и компоненты
 */

import * as React from 'react';
import { Logger } from 'UICommon/Utils';

import { DraggingCounterTemplate } from 'Controls/baseList';
import { default as Marker } from 'Controls/markerComponent';
import { StickyGroupedBlock } from 'Controls/stickyBlock';
import { TGridVPaddingSize } from 'Controls/interface';

import { ICellComponentProps, TDisplayType } from './interface';
import ActionsWrapper from 'Controls/_grid/dirtyRender/cell/components/ActionsWrapper';
import { EditArrowComponent } from 'Controls/listVisualAspects';
import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';
import {
    getHorizontalMarginsClasses,
    getHorizontalOffsetClasses,
    getVerticalPaddingsClasses,
    THorizontalMarginsSize,
} from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';
import { getRowSeparatorClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/RowSeparator';
import { getColumnSeparatorClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnSeparator';
import { getBackgroundColorStyleClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/BackgroundColorStyle';

const DEFAULT_PROPS: Partial<ICellComponentProps> = {
    hoverBackgroundStyle: 'default',
    backgroundStyle: 'default',
};

const DISPLAY_TYPES = ['block', 'inline-block', 'flex', 'inline-flex', 'contents', 'hidden'];

function validateDisplayType(value: string): TDisplayType {
    if (DISPLAY_TYPES.indexOf(value) !== -1) {
        return value;
    }
    return 'flex';
}

/*
 * Метод для рассчетов классов, навешиваемых на ячейку
 */
export function getClassName({
    isFirstCell,
    isHasStickyProperty,
    isStickyLadderCell,
    isHiddenForLadder,
    isLastCell,
    fontSize,
    fontColorStyle,
    fontWeight,
    cursor = 'pointer',
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginLeft,
    marginRight,
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
    cellUnderline,
    fadedClass,
    isNodeFooterCell,
    nodeFooterTemplate,
    isDragged,
    colspan,
    decorationStyle = 'default',
}: ICellComponentProps): string {
    if (isNodeFooterCell && nodeFooterTemplate) {
        return propsClassName ?? '';
    }

    let className = 'controls-GridReact__cell';

    className += ` controls-GridReact__cell-${decorationStyle}`;

    if (isHasStickyProperty) {
        if (isHiddenForLadder) {
            className = ' controls-Grid__ladder_sticky_z_index_cell';
        }
    }

    className += ` ${fadedClass}`;

    className += ' js-controls-GridReact__cell js-controls-Grid__row-cell';

    className += ` controls-GridReact__cell__hoverMode_${hoverMode}`;

    className += ' js-controls-ListView__editingTarget';

    className += ' controls-ListView__item_contentWrapper';

    if (colspan > 1) {
        className += ' js-controls-Grid__cell_colspaned';
    }

    if (displayType) {
        className += ` tw-${validateDisplayType(displayType)}`;
    }

    if (cellUnderline) {
        className += ' controls-GridReact__cell-underline';
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

    if (minHeightClassName) {
        className += ` ${minHeightClassName}`;
    }

    if (propsClassName) {
        className += ` ${propsClassName}`;
    }

    if (fontSize) {
        className += ` controls-fontsize-${fontSize}`;
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

    className += getVerticalPaddingsClasses(
        paddingTop as TGridVPaddingSize,
        paddingBottom as TGridVPaddingSize
    );
    className += getHorizontalOffsetClasses(paddingLeft, paddingRight);
    className += getHorizontalMarginsClasses(
        marginLeft as THorizontalMarginsSize,
        marginRight as THorizontalMarginsSize,
        isFirstCell,
        isLastCell
    );

    if (!stickied && backgroundStyle && backgroundStyle !== 'none') {
        className += getBackgroundColorStyleClasses(backgroundStyle);
    }
    if (
        hoverBackgroundStyle &&
        hoverBackgroundStyle !== 'none' &&
        highlightOnHover !== false &&
        !isStickyLadderCell
    ) {
        className += ` controls-hover-background-${hoverBackgroundStyle}`;
    }

    if (isMarked) {
        if (backgroundStyle === 'master_selected') {
            className += ' controls-Grid__row-cell_selected-master';
        } else {
            className += ` controls-Grid__row-cell_selected-${backgroundStyle}`;
        }
    }

    if (halign) {
        if (halign === 'right') {
            className += ' tw-justify-end tw-text-end ';
        }
        if (halign === 'center') {
            className += ' tw-justify-center tw-text-center ';
        }
        if (halign === 'left') {
            className += ' tw-justify-start tw-text-start ';
        }
    }

    if (valign === 'top' || valign === 'start') {
        className += ' tw-h-full tw-items-start';
    } else if (valign === 'bottom' || valign === 'end') {
        className += ' tw-h-full tw-items-end';
    } else if (valign === 'center') {
        className += ' tw-items-center';
    } else if (valign === 'baseline') {
        // baseline
        className += ' tw-items-baseline controls-GridReact__cell-baseline';
        if (minHeight !== 'null') {
            className += ` controls-GridReact__cell-baseline_${baseline}`;
        }
    }

    if (!isStickyLadderCell) {
        className += getRowSeparatorClasses({
            topSeparatorSize,
            topSeparatorStyle,
            bottomSeparatorSize,
            bottomSeparatorStyle,
        });

        className += getColumnSeparatorClasses({
            leftSeparatorSize,
            rightSeparatorSize,
        });
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
        if (!isFirstCell && !isLastCell) {
            className += ' controls-GridReact__cell_shadow-mask';
        }

        if (isFirstCell && !isLastCell) {
            className += ' controls-GridReact__first-cell_shadow-mask';
        }

        if (isLastCell && !isFirstCell) {
            className += ' controls-GridReact__last-cell_shadow-mask';
        }
    }

    if (editing) {
        className += ' controls-Grid__row-cell-editing';
    }

    // Класс, необходимый для измерений ширины, взятия фона ячейки и тд.
    className += ' js-controls-ListView__measurableContainer';

    if (isDragged) {
        className += ' controls-ListView__item_dragging';
    }

    return className;
}

/*
 * Метод для получения стилей, которые будут записаны в атрибут style на ячейке
 */
export function getStyles(props: ICellComponentProps): React.CSSProperties {
    const styles: React.CSSProperties = { ...props.style };
    if (props.startColspanIndex !== undefined) {
        const endIndex =
            // @ts-ignore
            !!props.cCountStart && props.isLastCell ? '-1' : props.endColspanIndex;
        styles.gridColumn = `${props.startColspanIndex} / ${endIndex || 'auto'}`;
    }
    if (props.startRowspanIndex !== undefined) {
        styles.gridRow = `${props.startRowspanIndex} / ${props.endRowspanIndex || 'auto'}`;
    }
    return styles;
}

interface IGetMarkerClassName {
    markerClassName: ICellComponentProps['markerClassName'];
    markerPosition: ICellComponentProps['markerPosition'];
    topLeftBorderRadius: ICellComponentProps['topLeftBorderRadius'] | 'default';
    paddingTop: ICellComponentProps['paddingTop'];
    decorationStyle: ICellComponentProps['decorationStyle'];
    markerSize: ICellComponentProps['markerSize'];
}

/*
 * Метод для формирования строки классов маркера
 */
function getMarkerClassName({
    markerClassName,
    markerPosition = 'default',
    topLeftBorderRadius = 'default',
    paddingTop = 'null',
    decorationStyle = 'default',
    markerSize = 'content-xs',
}: IGetMarkerClassName) {
    let className = markerClassName + ' controls-GridReact__cell-marker';
    if (markerPosition === 'default') {
        className += ' controls-GridReact__cell-marker_default';
    } else if (markerPosition === 'outside') {
        className += ` controls-ListView__itemV_marker_outside_${markerSize}`;
    }
    // На маркер вешаем выравнивание по базовой линии, т.к. он расположен абсолютно и
    // не выравнивается от грида.
    className += ' controls-GridReact__cell-baseline_default';

    // Если маркер выровнен по картинке, нужно смещать его до уровня картинки.
    if (markerSize?.includes('image')) {
        className += ' controls-ListView__itemV_marker_with_image';
    }

    // По умолчанию располагаем маркер в абсолютных координатах относительно верхнего левого угла.
    // Если есть отступ сверху или скругление, маркер надо сместить чуть ниже.
    const hasRoundBorder = topLeftBorderRadius !== 'default';
    const hasTopSpacing = paddingTop !== 'null';
    if (hasTopSpacing || (hasRoundBorder && !hasTopSpacing)) {
        const topSpacing = hasTopSpacing ? paddingTop.toLowerCase() : topLeftBorderRadius;
        className += ` controls-ListView__itemV_marker-${decorationStyle}_topPadding-${topSpacing}`;
    }

    return className;
}

/*
 * Компонент ячейки
 */
function CellComponent(
    props: ICellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const hoverBackgroundStyle = props.hoverBackgroundStyle ?? DEFAULT_PROPS.hoverBackgroundStyle;
    const beforeContentRender = props.beforeContentRender
        ? React.cloneElement(props.beforeContentRender, { ...props, children: undefined })
        : null;
    const afterContentRender = props.afterContentRender
        ? React.cloneElement(props.afterContentRender, { ...props, children: undefined })
        : null;

    const marker = props.markerVisible && props.marker && (
        <Marker
            markerSize={props.markerSize}
            className={getMarkerClassName({
                markerClassName: props.markerClassName,
                markerPosition: props.markerPosition,
                paddingTop: props.paddingTop,
                topLeftBorderRadius: props.topLeftBorderRadius,
                decorationStyle: props.decorationStyle,
                markerSize: props.markerSize,
            })}
        />
    );

    const actions = (
        <ActionsWrapper
            actionsVisibility={props.actionsVisibility}
            actionsPosition={props.actionsPosition}
            actionHandlers={props.actionHandlers}
            hoverBackgroundStyle={hoverBackgroundStyle}
            highlightOnHover={props.highlightOnHover}
            backgroundStyle={
                props.backgroundColorStyle || props.backgroundStyle || DEFAULT_PROPS.backgroundStyle
            }
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
            {beforeContentRender}
            {props.render}
            {afterContentRender}
            {editArrow}
            {tag}
            {actions}
            {draggingCounter}
        </>
    );

    const className = getClassName(props);
    const style = getStyles(props);
    const title = props.tooltip !== undefined && props.tooltip !== '' ? props.tooltip : null;
    const dataQa = props['data-qa'] || props.attributes?.['data-qa'] || 'cell';

    if (props.stickied) {
        return (
            <StickyGroupedBlock
                className={className}
                position={props.stickyPosition}
                mode={props.stickyMode}
                zIndex={null}
                fixedZIndex={null}
                forwardedRef={ref}
                backgroundStyle={props.stickiedBackgroundStyle}
                fixedBackgroundStyle={props.fixedBackgroundStyle}
                shadowVisibility={props.shadowVisibility}
                attrs={{
                    style,
                    title,
                    'data-qa': dataQa,
                }}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseMove={props.onMouseMove}
                onMouseOver={props.onMouseOver}
                pixelRatioBugFix={props.pixelRatioBugFix}
                subPixelArtifactFix={props.subPixelArtifactFix}
            >
                {content}
            </StickyGroupedBlock>
        );
    }

    const CellTag = props.href ? 'a' : 'div';
    return (
        <CellTag
            {...props.attributes}
            href={props.href ? props.href : null}
            ref={ref}
            className={className}
            tabIndex={props.tabIndex}
            style={style}
            title={title}
            data-qa={dataQa}
            data-name={props.dataName}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseMove={props.onMouseMove}
            onMouseOver={props.onMouseOver}
        >
            {content}
        </CellTag>
    );
}

export default React.memo(React.forwardRef(CellComponent));
