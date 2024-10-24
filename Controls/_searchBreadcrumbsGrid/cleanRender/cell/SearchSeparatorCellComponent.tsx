import * as React from 'react';
import {
    BackgroundClassUtils,
    BaseCellComponent,
    BaseCellRenderUtils,
    ColumnScrollClassUtils,
    ColumnSeparatorClassUtils,
    IBaseCellComponentProps,
    IHorizontalCellPadding,
    OffsetClassUtils,
    RowSeparatorClassUtils,
    RowSeparatorUtils,
} from 'Controls/grid';

export interface ISearchSeparatorCellComponentProps
    extends IBaseCellComponentProps,
        RowSeparatorUtils.IRowSeparators,
        BackgroundClassUtils.IGetHoverBackgroundColorStyleClasses,
        BackgroundClassUtils.IGetBackgroundColorStyleClasses,
        ColumnScrollClassUtils.IGetColumnScrollClasses {
    decorationStyle?: 'default' | 'master';
    endColumn?: number;
    isFirstCell: boolean;
    isLastCell: boolean;
    padding: IHorizontalCellPadding;
    startColumn?: number;
}

function getStyle(
    props: Pick<ISearchSeparatorCellComponentProps, 'style' | 'startColumn' | 'endColumn'>
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

function getBaseClasses(props: {
    decorationStyle: ISearchSeparatorCellComponentProps['decorationStyle'];
}) {
    return (
        'controls-GridReact__cell' +
        ` controls-GridReact__cell-${props.decorationStyle}` +
        ' js-controls-Grid__row-cell' +
        ' controls-ListView__item_contentWrapper' +
        ' tw-flex'
    );
}

function getMinHeightClasses(props: {
    decorationStyle: ISearchSeparatorCellComponentProps['decorationStyle'];
}) {
    return ` controls-Grid__row-cell_default_style-${props.decorationStyle}_min_height`;
}

function getPositionClasses(stickied: boolean) {
    return !stickied ? ' tw-relative' : '';
}

function getPaddingClasses(padding: ISearchSeparatorCellComponentProps['padding']): string {
    return OffsetClassUtils.getHorizontalPaddingsClasses(padding.left, padding.right);
}

function getColspanClasses(colspan: ISearchSeparatorCellComponentProps['colspan']) {
    let classes = ' controls-Grid__row-cell__content_colspaned';
    classes += ' tw-grow tw-box-border tw-max-w-full tw-min-w-0';
    if (colspan && colspan > 1) {
        classes += ' js-controls-Grid__cell_colspaned';
    }
    return classes;
}

function getFirstLastCellClasses(isFirstCell: boolean) {
    return isFirstCell ? ' controls-GridReact__cell_first' : '';
}

function getBackgroundClasses({
    hoverBackgroundStyle,
    highlightOnHover,
    isStickyLadderCell,
    backgroundStyle,
    isSticky,
}: {
    hoverBackgroundStyle: ISearchSeparatorCellComponentProps['hoverBackgroundStyle'];
    highlightOnHover: ISearchSeparatorCellComponentProps['highlightOnHover'];
    isStickyLadderCell: ISearchSeparatorCellComponentProps['isStickyLadderCell'];
    backgroundStyle: ISearchSeparatorCellComponentProps['backgroundStyle'];
    isSticky: ISearchSeparatorCellComponentProps['isSticky'];
}) {
    let classes = BackgroundClassUtils.getHoverBackgroundColorStyleClasses({
        hoverBackgroundStyle,
        highlightOnHover,
        isStickyLadderCell,
    });

    if (!isSticky && backgroundStyle && backgroundStyle !== 'none') {
        classes += BackgroundClassUtils.getBackgroundColorStyleClasses(backgroundStyle);
    }

    return classes;
}

export const SearchSeparatorComponent = React.forwardRef(function SearchSeparatorComponent(
    _props: {},
    ref?: React.ForwardedRef<HTMLSpanElement>
): JSX.Element {
    return <span ref={ref} className="controls-TreeGrid__row__searchSeparator_line_horizontal" />;
});

/**
 * Компонент ячейки разделителей записей из корня при поиске
 * @param props
 * @param ref
 * @constructor
 */
function SearchSeparatorCellComponent(
    props: ISearchSeparatorCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { tooltip } = props;

    const wrapperRenderClassName =
        getBaseClasses({
            decorationStyle: props.decorationStyle,
        }) +
        getPositionClasses(props.stickied) +
        getColspanClasses(props.colspan) +
        getPaddingClasses(props.padding) +
        getFirstLastCellClasses(props.isFirstCell) +
        getMinHeightClasses({
            decorationStyle: props.decorationStyle,
        }) +
        getBackgroundClasses({
            hoverBackgroundStyle: props.hoverBackgroundStyle,
            backgroundStyle: props.backgroundStyle,
            isSticky: props.isSticky,
            highlightOnHover: props.highlightOnHover,
            isStickyLadderCell: props.isStickyLadderCell,
        }) +
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
            bottomSeparatorStyle: props.bottomSeparatorStyle,
            topSeparatorStyle: props.topSeparatorStyle,
            bottomSeparatorSize: props.bottomSeparatorSize,
            topSeparatorSize: props.topSeparatorSize,
        }) +
        ColumnSeparatorClassUtils.getColumnSeparatorClasses({
            leftSeparatorSize: props.leftSeparatorSize,
            rightSeparatorSize: props.rightSeparatorSize,
        });

    const wrapperRenderStyle = getStyle(props);

    const contentRender = <SearchSeparatorComponent />;

    return (
        <BaseCellComponent
            {...BaseCellRenderUtils.getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={tooltip}
            contentRender={contentRender}
            data-qa={'cell'}
        />
    );
}

export default React.forwardRef(SearchSeparatorCellComponent);
