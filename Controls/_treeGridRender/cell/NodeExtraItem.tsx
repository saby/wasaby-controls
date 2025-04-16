/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import type { TListStyle } from 'Controls/baseList';
import { NavigationButton as MoreButtonTemplate } from 'Controls/listsCommonLogic';
import {
    BaseCellComponent,
    IBaseCellComponentProps,
    IHorizontalCellPadding,
    BaseCellRenderUtils,
    OffsetClassUtils,
    RowSeparatorClassUtils,
    ColumnSeparatorClassUtils,
    RowSeparatorUtils,
    BackgroundClassUtils,
    ColumnScrollClassUtils,
    CheckboxClassUtils,
} from 'Controls/gridRender';

import {
    ICellPositionProps,
    INavigationButtonConfig,
    TBackgroundStyle,
    TFontColorStyle,
    TNavigationButtonView,
} from 'Controls/interface';
import { ICellTypeProps } from 'Controls/_gridRender/cell/interface/ICell';

interface IDataCellHMarginProps {
    // Горизонтальные внешние отступы ячейки
    marginLeft?: OffsetClassUtils.THorizontalMarginsSize;
    marginRight?: OffsetClassUtils.THorizontalMarginsSize;
}

export interface INodeExtraItemCellComponentProps
    extends IBaseCellComponentProps,
        RowSeparatorUtils.IRowSeparators,
        ColumnScrollClassUtils.IGetColumnScrollClasses,
        IDataCellHMarginProps,
        ICellPositionProps,
        ICellTypeProps {
    // компонент, размещаемый перед contentRender
    beforeContentRender?: React.ReactElement;

    // колспан
    startColumn?: number;
    endColumn?: number;

    padding: IHorizontalCellPadding;

    isMoreButtonCell: boolean;

    decorationStyle: TListStyle;

    shouldDisplayExtraItem: boolean;
    shouldRenderHasMoreButton: boolean;

    loadMoreCaption: string;
    linkFontColorStyle: TFontColorStyle;

    navigationButtonView?: TNavigationButtonView;
    navigationButtonConfig?: INavigationButtonConfig;

    position?: 'header' | 'footer';

    backgroundColorStyle?: TBackgroundStyle;

    withoutExpanderPadding?: boolean;
    withoutLevelPadding?: boolean;
}

// wrapper render utils

function getStyle(
    props: Pick<INodeExtraItemCellComponentProps, 'style' | 'startColumn' | 'endColumn'>
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

// content render utils
function getContentRender(
    props: Pick<
        INodeExtraItemCellComponentProps,
        | 'contentRender'
        | 'beforeContentRender'
        | 'shouldDisplayExtraItem'
        | 'shouldRenderHasMoreButton'
        | 'isMoreButtonCell'
        | 'navigationButtonView'
        | 'navigationButtonConfig'
        | 'loadMoreCaption'
        | 'linkFontColorStyle'
        | 'position'
    >
) {
    const {
        contentRender,
        beforeContentRender,
        shouldDisplayExtraItem,
        shouldRenderHasMoreButton,
        isMoreButtonCell,
        navigationButtonView,
        navigationButtonConfig,
        loadMoreCaption,
        linkFontColorStyle,
    } = props;

    if (!shouldDisplayExtraItem && !contentRender) {
        return null;
    }

    const position = props.position
        ? props.position.charAt(0).toUpperCase() + props.position.slice(1)
        : 'Footer';

    return (
        <div className="controls-TreeGrid__nodeExtraItem-cell__content controls-TreeGrid__nodeExtraItem-minHeight controls-TreeGrid__nodeExtraItemContent__baseline">
            {!beforeContentRender ? null : beforeContentRender}
            {!shouldRenderHasMoreButton ? null : (
                <MoreButtonTemplate
                    buttonView={navigationButtonView}
                    buttonConfig={navigationButtonConfig}
                    loadMoreCaption={loadMoreCaption}
                    linkFontColorStyle={linkFontColorStyle}
                    linkFontSize="xs"
                    linkClass={`controls-Tree__node${position}LoadMore controls-TreeGrid__node${position}LoadMore`}
                />
            )}
            {isMoreButtonCell ? null : <div className="tw-w-full tw-min-w-0">{contentRender}</div>}
        </div>
    );
}

function getBaseClasses(
    className: INodeExtraItemCellComponentProps['className'],
    cellType: INodeExtraItemCellComponentProps['cellType'],
    decorationStyle: INodeExtraItemCellComponentProps['decorationStyle']
): string {
    if (cellType === 'checkbox') {
        return CheckboxClassUtils.getCheckboxClasses(cellType, decorationStyle);
    }

    let baseClasses = ' controls-TreeGrid__node-extraItem__wrapper';

    if (className) {
        baseClasses += ` ${className}`;
    }

    return baseClasses;
}

function getPaddingClasses(padding?: INodeExtraItemCellComponentProps['padding']): string {
    if (!padding) {
        return '';
    }
    return OffsetClassUtils.getHorizontalPaddingsClasses(padding.left, padding.right);
}

/**
 * Компонент ячейки шапки или подвала развёрнутого узла.
 * @param props
 * @param ref
 * @constructor
 */
function NodeExtraItem(
    props: INodeExtraItemCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const {
        className,
        tooltip,
        topSeparatorSize,
        topSeparatorStyle,
        bottomSeparatorSize,
        bottomSeparatorStyle,
        leftSeparatorSize,
        rightSeparatorSize,
        cellType,
        decorationStyle,
        backgroundColorStyle,
    } = props;

    const wrapperRenderClassName =
        getBaseClasses(className, cellType, decorationStyle) +
        getPaddingClasses(props.padding) +
        OffsetClassUtils.getHorizontalMarginsClasses(
            props.marginLeft,
            props.marginRight,
            props.isFirstCell,
            props.isLastCell
        ) +
        BackgroundClassUtils.getBackgroundColorStyleClasses(backgroundColorStyle) +
        ColumnScrollClassUtils.getColumnScrollClasses({
            hasColumnScroll: props.hasColumnScroll,
            columnScrollViewMode: props.columnScrollViewMode,
            columnScrollSelectors: props.columnScrollSelectors,
            columnScrollIsFixedCell: props.columnScrollIsFixedCell,
            columnScrollIsFixedToEnd: props.columnScrollIsFixedToEnd,
            hasColumnResizer: props.hasColumnResizer,
            isSingleColspanedCell: props.isSingleColspanedCell,
            isActsAsRowTemplate: props.isSingleColspanedCell,
        }) +
        RowSeparatorClassUtils.getRowSeparatorClasses({
            topSeparatorSize,
            topSeparatorStyle,
            bottomSeparatorSize,
            bottomSeparatorStyle,
        }) +
        ColumnSeparatorClassUtils.getColumnSeparatorClasses({
            leftSeparatorSize,
            rightSeparatorSize,
        });

    const wrapperRenderStyle = getStyle(props);

    const contentRender = getContentRender(props);

    return (
        <BaseCellComponent
            {...BaseCellRenderUtils.getBaseCellProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={tooltip}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(NodeExtraItem);
