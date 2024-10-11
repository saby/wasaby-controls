/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import {
    CursorUtils,
    SortingButton as SortingButtonComponent,
    TOverflow,
    TResultsPosition,
} from 'Controls/baseGrid';
import { default as BaseCellComponent, IBaseCellComponentProps } from './BaseCellComponent';
import {
    TBackgroundStyle,
    TCursor,
    TFontColorStyle,
    TFontSize,
    THorizontalAlign,
    TSortingValue,
    TVerticalAlign,
} from 'Controls/interface';
import { getBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
import { getHorizontalOffsetClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';
import { getColumnScrollClasses as getColumnScrollClassesUtil } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnScroll';
import {
    getAlignClasses as getAlignClassesUtil,
    getVAlignClasses as getVAlignClassesUtil,
} from 'Controls/_grid/cleanRender/cell/utils/Classes/Align';
import { IHorizontalCellPadding } from 'Controls/_grid/dirtyRender/cell/interface';
import { IGridSelectors, TColumnScrollViewMode } from 'Controls/gridColumnScroll';
import { getColumnSeparatorClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnSeparator';
import { getFontSizeClasses as getFontSizeClassesUtil } from 'Controls/_grid/cleanRender/cell/utils/Classes/FontSize';
import { getBackgroundColorStyleClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/BackgroundColorStyle';

export type THeaderCellType = 'ladder' | 'checkbox' | 'base';

export interface IHeaderCellConfig {
    // выравнивание контента заголовка
    align?: THorizontalAlign;
    valign?: TVerticalAlign;
    baseline?: string;

    fontColorStyle?: TFontColorStyle;
    fontSize?: TFontSize;

    // текст заголовка
    caption?: string;
    textOverflow?: TOverflow;
    whiteSpace?: string;

    // подсказка
    tooltip?: string;

    // сортировка
    sortingIcon?: string;
    sortingProperty?: string;

    // многоуровневый заголовок
    startRow?: number;
    endRow?: number;
    startColumn?: number;
    endColumn?: number;
}

// скролл колонок
export interface IHeaderCellColumnScrollProps {
    hasColumnScroll: boolean;
    columnScrollViewMode: TColumnScrollViewMode;
    columnScrollSelectors: IGridSelectors;
    columnScrollIsFixedCell: boolean;
    columnScrollIsFixedToEnd: boolean;
    hasColumnResizer: boolean;
    isSingleColspanedCell: boolean;
    isActsAsRowTemplate: boolean;
}

export interface IHeaderCellComponentProps
    extends IBaseCellComponentProps,
        IHeaderCellConfig,
        IHeaderCellColumnScrollProps {
    // сортировка
    sortingValue?: TSortingValue;

    // многоуровневый заголовок
    isMultiline?: boolean;
    headerEndRow?: number;
    zIndex?: number;

    // замена опции style со значениями 'master' | 'default' (react не позволяет использовать опцию style)
    decorationStyle?: string;

    // отступы
    padding?: IHorizontalCellPadding;

    // тип ячейки
    cellType?: THeaderCellType;

    // результаты
    resultsPosition?: TResultsPosition | '';

    // компонент, размещаемый перед contentRender
    beforeContentRender?: React.ReactElement;

    // фон
    backgroundStyle?: TBackgroundStyle; // compatible
    backgroundColorStyle?: TBackgroundStyle;

    // Курсор
    cursor?: TCursor;
}

// wrapper render utils
function getBaseClasses(
    props: Pick<IHeaderCellComponentProps, 'className' | 'decorationStyle' | 'isSticky'>
) {
    const { className, decorationStyle, isSticky } = props;

    let baseClasses =
        'js-controls-GridReact__cell controls-Grid__header-cell controls-GridReact__header-cell' +
        ` controls-Grid__cell_${decorationStyle}`;

    if (!isSticky) {
        baseClasses += ' tw-static';
    }

    if (className) {
        baseClasses += ` ${className}`;
    }

    return baseClasses;
}

function getFontColorClasses(props: Pick<IHeaderCellComponentProps, 'fontColorStyle'>) {
    const { fontColorStyle } = props;

    if (!fontColorStyle) {
        // Дефолтный цвет, который темизируется в других темах
        return ' controls-GridReact__header-cell_color';
    }
}

function getCheckboxClasses(cellType: IHeaderCellComponentProps['cellType']) {
    if (cellType === 'checkbox') {
        return (
            ' js-controls-Grid__header-cell-checkbox' +
            ' controls-Grid__header-cell-checkbox' +
            ' controls-Grid__header-cell-checkbox_min-width'
        );
    }

    return '';
}

function getColumnScrollClasses(
    props: Pick<
        IHeaderCellComponentProps,
        | 'cellType'
        | 'isMultiline'
        | 'endRow'
        | 'headerEndRow'
        | 'resultsPosition'
        | 'hasColumnScroll'
        | 'columnScrollViewMode'
        | 'columnScrollSelectors'
        | 'columnScrollIsFixedCell'
        | 'columnScrollIsFixedToEnd'
        | 'hasColumnResizer'
        | 'isSingleColspanedCell'
        | 'isActsAsRowTemplate'
    >
) {
    return getColumnScrollClassesUtil(props) + getClassesDependingOnColumnScroll(props);
}

function getClassesDependingOnColumnScroll(
    props: Pick<
        IHeaderCellComponentProps,
        | 'cellType'
        | 'hasColumnScroll'
        | 'columnScrollViewMode'
        | 'isMultiline'
        | 'endRow'
        | 'headerEndRow'
        | 'resultsPosition'
    >
) {
    const {
        cellType,
        columnScrollViewMode,
        hasColumnScroll,
        isMultiline,
        endRow,
        headerEndRow,
        resultsPosition,
    } = props;
    let classes = '';

    if (hasColumnScroll) {
        // Отступ под кнопки прокрутки горизонтального скролла.
        // Добавляется только к ячейкам последней строки.
        if (
            columnScrollViewMode === 'arrows' &&
            !(resultsPosition && resultsPosition === 'top') &&
            (!isMultiline || (isMultiline && endRow === headerEndRow))
        ) {
            classes += ' controls-Grid__header-cell_withColumnScrollArrows';
        }
    } else if (cellType !== 'checkbox') {
        classes += ' controls-Grid__header-cell_min-width';
    }

    return classes;
}

function getPaddingClasses(padding: IHeaderCellComponentProps['padding']) {
    return getHorizontalOffsetClasses(padding?.left, padding?.right);
}

function getMinHeightClasses(isMultiline: IHeaderCellComponentProps['isMultiline']) {
    if (isMultiline) {
        return ' controls-Grid__multi-header-cell_min-height';
    }

    return ' controls-Grid__header-cell_min-height';
}

function getBaselineClasses(
    isMultiline: IHeaderCellComponentProps['isMultiline'],
    baseline: IHeaderCellComponentProps['baseline']
) {
    if (isMultiline) {
        return ' controls-Grid__row-multi-header__content_baseline';
    }

    return ` controls-Grid__row-header__content_baseline_${baseline ?? 'default'}`;
}

function getHAlignClasses(align: IHeaderCellComponentProps['align']) {
    return align ? getAlignClassesUtil(align) : '';
}

function getVAlignClasses(valign: IHeaderCellComponentProps['valign']) {
    return valign ? getVAlignClassesUtil(valign) : '';
}

function getFontSizeClasses(fontSize?: TFontSize) {
    return getFontSizeClassesUtil(fontSize);
}

// Классы курсора для ячейки
function getCursorClasses(
    cursor?: TCursor,
    hasColumnScroll?: IHeaderCellComponentProps['hasColumnScroll'],
    columnScrollIsFixedCell?: IHeaderCellComponentProps['columnScrollIsFixedCell']
): string {
    const isScrollable = hasColumnScroll && !columnScrollIsFixedCell;
    const _cursor = CursorUtils.getCursor(cursor, isScrollable);
    return ` tw-cursor-${_cursor}`;
}

function getRowSeparatorElement(
    props: Pick<
        IHeaderCellComponentProps,
        'isMultiline' | 'startRow' | 'endRow' | 'headerEndRow' | 'padding'
    >
) {
    const { isMultiline, startRow, endRow, headerEndRow } = props;

    if (isMultiline && headerEndRow !== endRow && startRow && endRow && endRow - startRow === 1) {
        const paddingClasses = getHorizontalOffsetClasses(
            props?.padding?.left,
            props?.padding?.right
        );
        return (
            <div
                className={`controls-Grid__cell_header-content_border-bottom ${
                    paddingClasses ?? ''
                }`}
            ></div>
        );
    }

    return null;
}

function getStyle(
    props: Pick<
        IHeaderCellComponentProps,
        'style' | 'startRow' | 'endRow' | 'startColumn' | 'endColumn' | 'zIndex'
    >
): React.CSSProperties | undefined {
    const { startRow, endRow, startColumn, endColumn, zIndex } = props;
    if (startRow || startColumn) {
        const resultStyles = { ...props.style };

        if (startRow) {
            resultStyles.gridRow = `${startRow} / ${endRow}`;
        }

        if (startColumn) {
            resultStyles.gridColumn = `${startColumn} / ${endColumn}`;
        }

        if (zIndex !== undefined) {
            resultStyles.zIndex = zIndex;
        }

        return resultStyles;
    }
    return props.style;
}

// Классы курсора для рендера
function getRenderCursorClasses(cursor: TCursor) {
    return ` tw-cursor-${cursor}`;
}

// content render utils
function getContentRender(
    props: Pick<
        IHeaderCellComponentProps,
        | 'contentRender'
        | 'align'
        | 'textOverflow'
        | 'caption'
        | 'tooltip'
        | 'sortingProperty'
        | 'sortingValue'
        | 'sortingIcon'
        | 'cursor'
        | 'whiteSpace'
    >
): React.ReactElement {
    const { contentRender, sortingProperty } = props;

    // Если задан рендер контента, то используем его
    if (contentRender) {
        return contentRender;
    }

    // Если задана сортировка, то в качестве контента рендерим компонент сортировки
    if (sortingProperty) {
        const {
            align,
            textOverflow,
            whiteSpace,
            caption,
            sortingProperty,
            sortingValue,
            sortingIcon,
        } = props as Required<IHeaderCellComponentProps>;

        return (
            <SortingButtonComponent
                className="controls-Grid__sorting-button"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Неправильный тип "TAlign" в компоненте SortingButtonComponent (не поддерживает "center")
                align={align}
                textOverflow={textOverflow}
                whiteSpace={whiteSpace}
                caption={caption}
                property={sortingProperty}
                value={sortingValue}
                sortingIcon={sortingIcon}
            />
        );
    }

    // В остальных случаях вручную формируем рендер контента
    const { textOverflow, caption, tooltip, whiteSpace, cursor } = props;

    let contentRenderClassName =
        'controls-Grid__header-cell__content__innerWrapper' + getRenderCursorClasses(cursor);

    if (textOverflow === 'ellipsis' && !whiteSpace) {
        contentRenderClassName +=
            ' controls-Grid__header-cell__content-ellipsis controls-Grid__header-cell__content-nowrap';
    } else {
        contentRenderClassName += ` controls-Grid__header-cell__content-${
            textOverflow ?? 'none'
        } controls-Grid__header-cell__content-${whiteSpace ?? 'normal'}`;
    }

    return (
        <div title={tooltip || caption} className={contentRenderClassName}>
            {caption}
        </div>
    );
}

function HeaderCellComponent(
    props: IHeaderCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const {
        padding,
        isMultiline,
        tooltip,
        align,
        valign,
        baseline,
        cellType,
        leftSeparatorSize,
        rightSeparatorSize,
        fontSize,
        backgroundColorStyle,
    } = props;

    const wrapperRenderClassName =
        getBaseClasses(props) +
        getFontColorClasses(props) +
        getCheckboxClasses(cellType) +
        getColumnScrollClasses(props) +
        getPaddingClasses(padding) +
        getBackgroundColorStyleClasses(backgroundColorStyle) +
        getMinHeightClasses(isMultiline) +
        getFontSizeClasses(fontSize) +
        getCursorClasses('default', props.hasColumnScroll, props.columnScrollIsFixedCell) +
        getColumnSeparatorClasses({ leftSeparatorSize, rightSeparatorSize });
    const wrapperRenderStyle = getStyle(props);

    const contentRender = (
        <>
            {getRowSeparatorElement(props)}
            <div
                className={
                    'controls-Grid__header-cell__content ' +
                    getHAlignClasses(align) +
                    getVAlignClasses(valign) +
                    getBaselineClasses(isMultiline, baseline)
                }
            >
                {props.beforeContentRender ?? null}
                {getContentRender(props)}
            </div>
        </>
    );

    return (
        <BaseCellComponent
            {...getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={tooltip}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(HeaderCellComponent);
