/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { default as BaseCellComponent, IBaseCellComponentProps } from './BaseCellComponent';
import { TFontColorStyle, TFontSize, TFontWeight, THorizontalAlign } from 'Controls/interface';
import { getBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
import { Money, Number } from 'Controls/baseDecorator';
import { IHorizontalCellPadding } from 'Controls/_grid/dirtyRender/cell/interface';
import { TOverflow } from 'Controls/baseGrid';
import {
    getHorizontalOffsetClasses,
    getVerticalPaddingsClasses,
} from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';
import { getColumnScrollClasses as getColumnScrollClassesUtil } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnScroll';
import { getBackgroundColorStyleClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/BackgroundColorStyle';
import { TResultsPosition } from 'Controls/baseGrid';
import { getColumnSeparatorClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnSeparator';
import { IColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';

export interface IResultsCellConfig {
    // выравнивание контента заголовка
    align?: THorizontalAlign;
    baseline?: string;

    // текст итогов
    textOverflow?: TOverflow;
    backgroundStyle?: string; // compatible
    backgroundColorStyle?: string;

    fontSize?: TFontSize;
    fontWeight?: TFontWeight;
    fontColorStyle?: TFontColorStyle;

    // колспан результатов
    startColumn?: number;
    endColumn?: number;

    // Есть ли вертикальные отступы в результатах
    resultsVerticalPadding?: boolean;

    // отступы
    padding?: IHorizontalCellPadding;

    // Позиция строки итогов - под хэадером или над футером
    resultsPosition?: TResultsPosition;
}

export interface IResultsCellComponentProps
    extends IBaseCellComponentProps,
        IResultsCellConfig,
        IColumnScrollProps {
    style?: React.CSSProperties;
    startColspanIndex?: number;
    cCountStart?: number;
    cCountEnd?: number;
    isLastCell?: boolean;
    endColspanIndex?: number;
    startRowspanIndex?: number;
    endRowspanIndex?: number;
    data?: string | number;
    format?: string;
    zIndex?: number;

    // компонент, размещаемый перед contentRender
    beforeContentRender?: React.ReactElement;

    // name?: string;
    // $wasabyRef?: any | React.ForwardedRef<any>;
    // forwardedRef?: any | React.ForwardedRef<any>;
    // attrs?: Record<string, any>;
    // context?: Record<string, unknown>;
    // ref?: React.Ref<any>;
    // onAfterMount?: () => void;
    // onAfterUpdate?: () => void;
}

/*------------------------------------------------------------------------------------------*/

// style нужен для stickied
function getStyle(
    props: Pick<
        IResultsCellComponentProps,
        | 'style'
        | 'startColspanIndex'
        | 'cCountStart'
        | 'cCountEnd'
        | 'isLastCell'
        | 'endColspanIndex'
        | 'startRowspanIndex'
        | 'endRowspanIndex'
        | 'zIndex'
    >
): React.CSSProperties | undefined {
    const styles: React.CSSProperties = { ...props.style };
    if (props.startColspanIndex) {
        const endIndex = !!props.cCountStart && props.isLastCell ? '-1' : props.endColspanIndex;
        styles.gridColumn = `${props.startColspanIndex} / ${endIndex || 'auto'}`;
    }
    if (props.startRowspanIndex !== undefined) {
        styles.gridRow = `${props.startRowspanIndex} / ${props.endRowspanIndex || 'auto'}`;
    }

    if (props.zIndex !== undefined) {
        styles.zIndex = props.zIndex;
    }
    return styles;
}

/*--------------------------------------Классы------------------------------------------*/

function getBaseClasses(
    className: IResultsCellComponentProps['className'],
    resultsPosition: IResultsCellComponentProps['resultsPosition']
) {
    let baseClasses =
        'js-controls-GridReact__cell controls-Grid__results-cell__content controls-GridReact__results-cell' +
        ` controls-GridReact__results-cell_${resultsPosition}`;

    if (className) {
        baseClasses += ` ${className}`;
    }

    return baseClasses;
}

function getMinHeightClasses(
    resultsVerticalPadding: IResultsCellComponentProps['resultsVerticalPadding']
) {
    if (resultsVerticalPadding) {
        return ' controls-Grid_results-cell_with-padding_min-height';
    }

    return ' controls-GridReact__minHeight-results';
}

function getColumnScrollClasses(props: IResultsCellComponentProps) {
    return (
        getColumnScrollClassesUtil(props as IColumnScrollProps) +
        getClassesDependingOnColumnScroll(props)
    );
}

function getClassesDependingOnColumnScroll(
    props: Pick<
        IResultsCellComponentProps,
        'hasColumnScroll' | 'columnScrollViewMode' | 'resultsPosition'
    >
) {
    const { columnScrollViewMode, hasColumnScroll, resultsPosition } = props;
    let classes = '';

    if (hasColumnScroll) {
        // Отступ под кнопки прокрутки горизонтального скролла.
        if (columnScrollViewMode === 'arrows' && resultsPosition === 'top') {
            classes += ' controls-Grid__header-cell_withColumnScrollArrows';
        }
    }

    return classes;
}

function getBaselineClasses(baseline: IResultsCellComponentProps['baseline']) {
    return ` controls-Grid__results-cell__content_baseline_${baseline ?? 'default'}`;
}

function getAlignClasses(align: IResultsCellComponentProps['align']) {
    if (align) {
        return ` controls-Grid__row-cell__content_halign_${align}`;
    }
    return '';
}

function getTextOverflowClasses(textOverflow: IResultsCellComponentProps['textOverflow']) {
    if (textOverflow === 'ellipsis') {
        return ' tw-text-ellipsis tw-text-nowrap';
    }
    return '';
}

function getFontColorStyleClasses(fontColorStyle: IResultsCellComponentProps['fontColorStyle']) {
    if (fontColorStyle) {
        return ` controls-text-${fontColorStyle}`;
    }
    return '';
}

function getFontSizeClasses(fontSize: IResultsCellComponentProps['fontSize']) {
    if (fontSize) {
        return ` controls-fontsize-${fontSize}`;
    }
    return '';
}

function getFontWeightClasses(fontWeight: IResultsCellComponentProps['fontWeight']) {
    if (fontWeight) {
        return ` controls-fontweight-${fontWeight}`;
    }
    return '';
}

/*------------------------------------------------------------------------------------------*/

// content render utils

function getContentRender(props: IResultsCellComponentProps): React.ReactElement {
    const {
        data,
        format,
        contentRender,
        textOverflow = 'none',
        fontWeight = 'bold',
        fontColorStyle = 'secondary',
        fontSize = 'm',
    } = props;

    //const column = gridColumn || colData || itemData;

    const textOverflowClasses = getTextOverflowClasses(textOverflow);

    // Если задан рендер контента, то используем его
    if (contentRender) {
        return contentRender;
    }

    // TODO: Нужно посмотреть, используется ли это, и если да,
    //  то вынести отсюда т.к. здесь не имеем доступа до коллекции
    // Если задан prop children, то используем его
    // if (children && children.length) {
    //     const passProps = {
    //         column,
    //         colData: column,
    //         results: column.getMetaResults(),
    //     };
    //     return React.cloneElement(props.children, passProps);
    // }

    if (data === undefined || data === null) {
        return null;
    }

    if (format === 'money') {
        return (
            <Money
                value={data}
                useGrouping
                fontWeight={fontWeight}
                fontColorStyle={fontColorStyle}
                fontSize={fontSize}
                className={textOverflowClasses}
            />
        );
    }

    if (format === 'integer' || format === 'real') {
        return (
            <Number
                value={data}
                useGrouping
                fractionSize={2}
                fontWeight={fontWeight}
                fontColorStyle={fontColorStyle}
                fontSize={fontSize}
                className={textOverflowClasses}
            />
        );
    }

    return data as unknown as React.ReactElement;
}

/*------------------------------------------------------------------------------------------*/

function ResultsCellComponent(
    props: IResultsCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const {
        className,
        baseline,
        align,
        textOverflow,
        backgroundColorStyle,
        fontColorStyle,
        fontSize,
        fontWeight,
        padding,
        resultsPosition,
    } = props;

    const wrapperRenderClassName =
        getBaseClasses(className, resultsPosition) +
        getColumnScrollClasses(props) +
        getMinHeightClasses(props.resultsVerticalPadding) +
        getHorizontalOffsetClasses(padding?.left, padding?.right) +
        getVerticalPaddingsClasses(padding?.top, padding?.bottom) +
        getBaselineClasses(baseline) +
        getAlignClasses(align) +
        getTextOverflowClasses(textOverflow) +
        getBackgroundColorStyleClasses(backgroundColorStyle) +
        getFontColorStyleClasses(fontColorStyle) +
        getFontSizeClasses(fontSize) +
        getFontWeightClasses(fontWeight) +
        getColumnSeparatorClasses(props);

    const wrapperRenderStyle = getStyle(props);

    const contentRender = (
        <>
            {props.beforeContentRender ?? null}
            {getContentRender(props)}
        </>
    );

    return (
        <BaseCellComponent
            {...getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            contentRender={contentRender}
            fixedZIndex={props.fixedZIndex}
        />
    );
}

export default React.forwardRef(ResultsCellComponent);
