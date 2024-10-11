/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import {
    BaseCellComponent,
    IBaseCellComponentProps,
    IHorizontalCellPadding,
    BaseCellRenderUtils,
    OffsetClassUtils,
    RowSeparatorUtils,
    BackgroundClassUtils,
    RowSeparatorClassUtils,
    ColumnSeparatorClassUtils,
    ColumnScrollClassUtils,
    IVerticalRowPadding,
    ActionsWrapper,
} from 'Controls/grid';
import PathComponent, {
    IPathComponentProps,
} from 'Controls/_searchBreadcrumbsGrid/cleanRender/PathComponent';
import { TCursor, TItemActionsPosition, TItemActionsVisibility } from 'Controls/interface';
import { NOT_EDITABLE_JS_SELECTOR } from 'Controls/baseList';

export interface ISearchBreadcrumbsCellComponentProps
    extends IBaseCellComponentProps,
        IPathComponentProps,
        RowSeparatorUtils.IRowSeparators,
        BackgroundClassUtils.IGetHoverBackgroundColorStyleClasses,
        BackgroundClassUtils.IGetBackgroundColorStyleClasses,
        ColumnScrollClassUtils.IGetColumnScrollClasses {
    padding: IHorizontalCellPadding & IVerticalRowPadding;
    isFirstCell: boolean;
    isLastCell: boolean;
    // колспан
    startColumn?: number;
    endColumn?: number;
    // itemactions
    actionsVisibility: TItemActionsVisibility;
    actionsPosition: TItemActionsPosition;
    actionsClassName: string;

    // Курсор
    cursor?: TCursor;
}

// wrapper render utils

function getStyle(
    props: Pick<ISearchBreadcrumbsCellComponentProps, 'style' | 'startColumn' | 'endColumn'>
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
function getContentRender(props: ISearchBreadcrumbsCellComponentProps): React.ReactElement {
    if (props.contentRender) {
        return props.contentRender;
    }

    return (
        <PathComponent
            keyProperty={props.keyProperty}
            displayProperty={props.displayProperty}
            readOnly={props.readOnly}
            containerWidth={props.containerWidth}
            backgroundStyle={props.backgroundStyle}
            items={props.items}
            searchValue={props.searchValue}
            onBreadCrumbsItemClick={props.onBreadCrumbsItemClick}
        />
    );
}

function getBaseClasses(props: ISearchBreadcrumbsCellComponentProps) {
    let className = 'controls-GridReact__cell';

    className += ` controls-GridReact__cell-${props.decorationStyle}`;

    className += ' js-controls-Grid__row-cell';

    className += ` controls-GridReact__cell__hoverMode_${props.hoverMode}`;

    className += ' controls-ListView__item_contentWrapper';

    // Класс, необходимый для измерений ширины, взятия фона ячейки и тд.
    className += ' js-controls-ListView__measurableContainer';

    if (props.className) {
        className += ` ${props.className}`;
    }

    return className;
}

function getEditableClasses(): string {
    return ` ${NOT_EDITABLE_JS_SELECTOR}`;
}

function getMinHeightClasses() {
    return ' controls-Grid__row-cell_breadCrumbsSearch_min_height';
}

function getPositionClasses(stickied: boolean) {
    return !stickied ? ' tw-relative' : '';
}

function getActionsVisibilityClasses(
    actionsVisibility: ISearchBreadcrumbsCellComponentProps['actionsVisibility']
): string {
    return actionsVisibility && actionsVisibility !== 'hidden'
        ? ' controls-GridReact__cell_actionsCell'
        : '';
}

function getColspanClasses(colspan: ISearchBreadcrumbsCellComponentProps['colspan']) {
    let classes = ' controls-Grid__row-cell__content_colspaned';
    if (colspan && colspan > 1) {
        classes += ' js-controls-Grid__cell_colspaned';
    }
    return classes;
}

// Классы курсора для ячейки
function getCursorClasses(cursor?: TCursor): string {
    return ` tw-cursor-${cursor}`;
}

function getFirstLastCellClasses(isFirstCell: boolean, isLastCell: boolean) {
    let classes = '';
    if (isFirstCell) {
        classes += ' controls-GridReact__cell_first';
    }

    if (isLastCell) {
        classes += ' controls-GridReact__cell_last';
    }
    return classes;
}

function getPaddingClasses(padding: ISearchBreadcrumbsCellComponentProps['padding']): string {
    return (
        OffsetClassUtils.getHorizontalOffsetClasses(padding.left, padding.right) +
        OffsetClassUtils.getVerticalPaddingsClasses(padding.top, padding.bottom)
    );
}

function getBackgroundClasses({
    hoverBackgroundStyle,
    highlightOnHover,
    isStickyLadderCell,
    backgroundStyle,
    isSticky,
}: {
    hoverBackgroundStyle: ISearchBreadcrumbsCellComponentProps['hoverBackgroundStyle'];
    highlightOnHover: ISearchBreadcrumbsCellComponentProps['highlightOnHover'];
    isStickyLadderCell: ISearchBreadcrumbsCellComponentProps['isStickyLadderCell'];
    backgroundStyle: ISearchBreadcrumbsCellComponentProps['backgroundStyle'];
    isSticky: ISearchBreadcrumbsCellComponentProps['isSticky'];
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

/**
 * Компонент ячейки с хлебными крошками при поиске
 * @param props
 * @param ref
 * @constructor
 */
function SearchBreadcrumbsCellComponent(
    props: ISearchBreadcrumbsCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { tooltip } = props;

    const wrapperRenderClassName =
        getBaseClasses(props) +
        getEditableClasses() +
        getPositionClasses(props.stickied) +
        getColspanClasses(props.colspan) +
        getPaddingClasses(props.padding) +
        getFirstLastCellClasses(props.isFirstCell, props.isLastCell) +
        getMinHeightClasses() +
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
        }) +
        getActionsVisibilityClasses(props.actionsVisibility) +
        getCursorClasses(props.cursor);

    const wrapperRenderStyle = getStyle(props);

    const itemActionsRender = (
        <ActionsWrapper
            actionsVisibility={props.actionsVisibility}
            actionHandlers={props.actionHandlers}
            hoverBackgroundStyle={props.hoverBackgroundStyle}
            backgroundStyle={props.backgroundStyle}
            actionsClassName={props.actionsClassName}
            highlightOnHover={props.highlightOnHover}
            actionsPosition={props.actionsPosition}
        />
    );

    const contentRender = (
        <>
            {getContentRender(props)}
            {itemActionsRender}
        </>
    );

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

export default React.forwardRef(SearchBreadcrumbsCellComponent);
