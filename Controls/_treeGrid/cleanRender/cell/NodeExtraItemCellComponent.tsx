/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { MoreButtonTemplate, TListStyle } from 'Controls/baseList';
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
} from 'Controls/grid';

import {
    INavigationButtonConfig,
    TBackgroundStyle,
    TFontColorStyle,
    TNavigationButtonView,
} from 'Controls/interface';

export interface INodeExtraItemCellComponentProps
    extends IBaseCellComponentProps,
        RowSeparatorUtils.IRowSeparators {
    // компонент, размещаемый перед contentRender
    beforeContentRender?: React.ReactElement;

    // колспан
    startColumn?: number;
    endColumn?: number;

    padding: IHorizontalCellPadding;

    isMoreButtonCell: boolean;
    isMultiselectCell: boolean;
    decorationStyle: TListStyle;

    shouldDisplayExtraItem: boolean;
    shouldRenderHasMoreButton: boolean;

    loadMoreCaption: string;
    linkFontColorStyle: TFontColorStyle;

    navigationButtonView?: TNavigationButtonView;
    navigationButtonConfig?: INavigationButtonConfig;

    position?: 'header' | 'footer';

    backgroundColorStyle?: TBackgroundStyle;
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
    isMultiselectCell: INodeExtraItemCellComponentProps['isMultiselectCell'],
    decorationStyle: INodeExtraItemCellComponentProps['decorationStyle']
): string {
    if (isMultiselectCell) {
        return ` controls-Grid__row-cell-checkbox-${decorationStyle}`;
    }

    let baseClasses = ' controls-TreeGrid__node-extraItem__wrapper';

    if (className) {
        baseClasses += ` ${className}`;
    }

    return baseClasses;
}

function getPaddingClasses(
    padding: INodeExtraItemCellComponentProps['padding'],
    isMultiselectCell: boolean
): string {
    if (isMultiselectCell) {
        return '';
    }

    return OffsetClassUtils.getHorizontalOffsetClasses(padding.left, padding.right);
}

/**
 * Компонент ячейки шапки или подвала развёрнутого узла.
 * @param props
 * @param ref
 * @constructor
 */
function NodeExtraItemCellComponent(
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
        isMultiselectCell,
        decorationStyle,
        backgroundColorStyle,
    } = props;

    const wrapperRenderClassName =
        getBaseClasses(className, isMultiselectCell, decorationStyle) +
        getPaddingClasses(props.padding, isMultiselectCell) +
        BackgroundClassUtils.getBackgroundColorStyleClasses(backgroundColorStyle) +
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
            {...BaseCellRenderUtils.getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={tooltip}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(NodeExtraItemCellComponent);
