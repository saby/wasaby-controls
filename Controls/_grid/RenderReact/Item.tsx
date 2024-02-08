/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { createElement, delimitProps, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Attr } from 'UICommon/Executor';

import { Model } from 'Types/entity';
import { StickyGroup, StickyGroupedBlock } from 'Controls/stickyBlock';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    TBackgroundStyle,
} from 'Controls/interface';
import { isFullGridSupport } from 'Controls/display';
import {
    DraggingCounterTemplate,
    getItemEventHandlers,
    IItemEventHandlers,
    IItemTemplateProps,
    ItemActionsTemplateSelector,
    itemPropsAreEqual,
    ListMarker,
} from 'Controls/baseList';

import Row from 'Controls/_grid/display/Row';
import CellModel from 'Controls/_grid/display/Cell';
import { FocusRoot } from 'UI/Focus';

interface IPropsCompatibility<TItem extends Row = Row> {
    itemData: TItem;
}

interface ILadderProps extends TInternalProps {
    content: React.Component | React.FunctionComponent;
    ladderProperty: string;
    stickyProperty: string;
    className?: string;
}

export interface IItemProps<
    TContents extends Model = Model,
    TItem extends Row<TContents> = Row<TContents>
> extends TInternalProps,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IItemEventHandlers,
        IItemTemplateProps<TContents, TItem> {
    hoverBackgroundStyle: TBackgroundStyle;
    backgroundStyle: TBackgroundStyle;
    fixedBackgroundStyle: TBackgroundStyle;
    templateHighlightOnHover: boolean;
    editable: boolean;
    clickable: boolean;
    stickyCallback: Function;
    isSticked: boolean;
    containerSize: number;

    _onBreadcrumbClick: Function;
    _onBreadcrumbItemClick: Function;

    onTagClick: (event: React.BaseSyntheticEvent, item: Row, columnIndex: number) => void;
    onTagHover: (event: React.BaseSyntheticEvent, item: Row, columnIndex: number) => void;

    columnOptions: object;
    beforeColumnContentTemplate:
        | React.Component<IItemProps & { column: CellModel }>
        | React.FunctionComponent<IItemProps & { column: CellModel }>;
    afterColumnContentTemplate:
        | React.Component<IItemProps & { column: CellModel }>
        | React.FunctionComponent<IItemProps & { column: CellModel }>;
}

function shouldDisplayActions(item: Row, column: CellModel) {
    return (
        item.SupportItemActions &&
        (item.getItemActionsPosition() !== 'custom' || item.shouldDisplaySwipeTemplate()) &&
        ((column.isLastColumn() && !item.hasItemActionsSeparatedCell()) ||
            column['[Controls/_display/grid/ItemActionsCell]'])
    );
}

function CellComponent(props: IItemProps & { wasabyContext: unknown; column: CellModel }) {
    const beforeContentTemplate = props.beforeColumnContentTemplate && (
        <props.beforeColumnContentTemplate
            {...props}
            key={'beforeColumnContentTemplate_' + props.column.getInstanceId()}
        />
    );
    const afterContentTemplate = props.afterColumnContentTemplate && (
        <props.afterColumnContentTemplate
            {...props}
            key={'afterColumnContentTemplate_' + props.column.getInstanceId()}
        />
    );

    const ladderWrapper = React.useCallback(
        (ladderProps: ILadderProps) => {
            const ladderProperty = ladderProps.ladderProperty;
            const stickyProperty = ladderProps.stickyProperty;
            const shouldDrawLadderContent =
                props.column.LadderContentCell &&
                props.item.shouldDrawLadderContent(ladderProperty, stickyProperty);
            let classes = props.item.getLadderWrapperClasses(ladderProperty, stickyProperty);
            if (ladderProps.className) {
                classes += ` ${ladderProps.className}`;
            } else if (ladderProps.attrs.className) {
                classes += ` ${ladderProps.attrs.className}`;
            }
            return shouldDrawLadderContent
                ? (createElement(ladderProps.content, undefined, {
                      ...ladderProps.attrs,
                      class: classes,
                  }) as JSX.Element)
                : null;
        },
        [props.column, props.item]
    );

    const multiSelectTemplate = React.useCallback(
        (multiSelectProps: TInternalProps) => {
            const shouldDisplayCheckbox =
                props.item.getMultiSelectVisibility() &&
                props.item.getMultiSelectVisibility() !== 'hidden';
            return (
                shouldDisplayCheckbox &&
                (createElement(
                    props.item.getMultiSelectTemplate() as React.Component,
                    {
                        item: props.item,
                        $wasabyRef: multiSelectProps.$wasabyRef,
                    } as object,
                    multiSelectProps.attrs as Attr.IAttributes
                ) as JSX.Element)
            );
        },
        [props.item]
    );

    const content = createElement(
        props.column.getTemplate() as React.Component,
        {
            fontColorStyle: props.fontColorStyle,
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            ...props.column.getTemplateOptions(),
            ...props.columnOptions,
            item: props.item,
            itemData: props.column,
            column: props.column,
            gridColumn: props.column,
            colData: props.column,
            theme: props.theme,
            style: props.style,
            cursor: props.cursor,
            containerSize: props.containerSize,
            backgroundColorStyle: props.backgroundColorStyle,
            backgroundStyle: props.backgroundStyle,
            contrastBackground: props.item.isMultiSelectContrastBackground(),
            highlightOnHover: props.highlightOnHover,
            itemActionsTemplate: props.itemActionsTemplate,
            itemActionsClass: props.itemActionsClass,
            templateHighlightOnHover: props.templateHighlightOnHover,
            hoverBackgroundStyle: props.hoverBackgroundStyle,
            _onBreadcrumbClick: props._onBreadcrumbClick,
            _onBreadcrumbItemClick: props._onBreadcrumbItemClick,
            horizontalPadding: props.style === 'master' ? '3xs' : props.horizontalPadding,
            onTagClick: props.column.TagCell ? props.onTagClick : undefined,
            onTagHover: props.column.TagCell ? props.onTagHover : undefined,
            readOnly: props.readOnly,
            ladderWrapper,
            multiSelectTemplate,
            beforeContentTemplate,
            afterContentTemplate,
        } as object,
        {
            ...props.attrs,
            class: props.stickyContentClass,
        },
        undefined,
        props.wasabyContext
    );

    const itemActions = shouldDisplayActions(props.item, props.column) ? (
        <ItemActionsTemplateSelector
            item={props.item}
            highlightOnHover={props.highlightOnHover}
            hoverBackgroundStyle={props.hoverBackgroundStyle}
            actionsVisibility={props.actionsVisibility}
            itemActionsClass={props.itemActionsClass}
            onActionsMouseEnter={props.onActionsMouseEnter}
            onActionMouseDown={props.onActionMouseDown}
            onActionMouseUp={props.onActionMouseUp}
            onActionMouseEnter={props.onActionMouseEnter}
            onActionMouseLeave={props.onActionMouseLeave}
            onActionClick={props.onActionClick}
            onItemActionSwipeAnimationEnd={props.onItemActionSwipeAnimationEnd}
            itemActionsTemplateMountedCallback={props.itemActionsTemplateMountedCallback}
            itemActionsTemplateUnmountedCallback={props.itemActionsTemplateUnmountedCallback}
        />
    ) : null;

    const draggingCounter = props.column.Draggable &&
        props.column.shouldDisplayDraggingCounter() && (
            <DraggingCounterTemplate itemsCount={props.column.getDraggedItemsCount()} />
        );

    return (
        <>
            <ListMarker
                item={props.column}
                className={props.markerClassName}
                marker={props.marker}
                markerSize={props.markerSize}
                markerPosition={props.markerPosition}
            />
            {content}
            {itemActions}
            {draggingCounter}
        </>
    );
}

// itemPropsAreEqual чтобы ячейка не перерисовывалась из-за StickyBlock.
// На column пока что не получается заточиться, т.к. там не всегда мы честно обновляем версию.
const Cell = React.memo(CellComponent, itemPropsAreEqual);

function RelativeCellWrapper(
    props: IItemProps & { column: CellModel; children: React.ReactElement }
): JSX.Element {
    if (isFullGridSupport()) {
        return props.children;
    } else {
        let classes = props.column.getRelativeCellWrapperClasses();
        if (props.column.isHidden()) {
            classes += ' ws-hidden';
        }
        return (
            <div className={classes} style={props.column.getRelativeCellWrapperStyles()}>
                {props.children}
            </div>
        );
    }
}

function CellWrapperComponent(props: IItemProps & { wasabyContext: unknown; column: CellModel }) {
    const column = props.column;

    let classes = column.getWrapperClasses(
        props.backgroundColorStyle,
        props.highlightOnHover,
        props.hoverBackgroundStyle,
        props.shadowVisibility,
        props.borderVisibility,
        props.borderStyle
    );
    if (column.isHidden()) {
        classes += ' ws-hidden';
    }
    if (
        props.item.getStyle() === 'master' &&
        props.item.getItemActionsPosition() === 'outside' &&
        shouldDisplayActions(props.item, props.column) &&
        props.item.hasVisibleActions()
    ) {
        classes += ' controls-Grid__row-cell__last-outsideActions-master';
    }
    const stringStyle = column.getWrapperStyles(props.containerSize);
    const objectStyle = wasabyAttrsToReactDom({ style: stringStyle }).style;
    const dataQa = column.listElementName;

    if (props.href) {
        classes += ' tw-block controls-ListView__itemV_href';
    }

    if (column.isStickied(props.isSticked)) {
        const attrs = {
            'data-qa': dataQa,
            style: objectStyle,
        };

        return (
            <StickyGroupedBlock
                position={column.getStickyHeaderPosition(props.stickyCallback)}
                mode={column.getStickyHeaderMode(props.stickyCallback)}
                shadowVisibility={column.shadowVisibility}
                _isIosZIndexOptimized={props.item.isIosZIndexOptimized()}
                subPixelArtifactFix={column.isNeedSubPixelArtifactFix(props.subPixelArtifactFix)}
                pixelRatioBugFix={props.pixelRatioBugFix}
                fixedPositionInitial={props.fixedPositionInitial}
                fixedZIndex={column.getZIndex()}
                backgroundStyle={column.getStickyBackgroundStyle()}
                fixedBackgroundStyle={
                    props.fixedBackgroundStyle || props.item.getFixedBackgroundStyle()
                }
                className={classes}
                stickyAttrs={attrs}
                wasabyContext={props.wasabyContext}
            >
                <Cell {...props} />
            </StickyGroupedBlock>
        );
    } else {
        let CellWrapperTag: keyof JSX.IntrinsicElements = 'td';
        if (isFullGridSupport()) {
            CellWrapperTag = props.href ? 'a' : 'div';
        }
        return (
            <CellWrapperTag
                className={classes}
                href={props.href ? props.href : null}
                style={objectStyle}
                data-qa={dataQa}
                colSpan={column.getColspan()}
                rowSpan={column.getRowspan()}
                key={`${column.getInstanceId()}_wrapper`}
            >
                <RelativeCellWrapper {...props}>
                    <Cell {...props} />
                </RelativeCellWrapper>
            </CellWrapperTag>
        );
    }
}

const CellWrapper = React.memo(CellWrapperComponent);

function Item(props: IItemProps): React.ReactElement {
    const { clearProps, context, $wasabyRef } = delimitProps(props) as {
        clearProps: IItemProps;
        userAttrs: object;
        context: object;
        $wasabyRef: (element: HTMLElement) => void;
    };
    propsCompatibility(clearProps as IItemProps & IPropsCompatibility);

    const item = props.item;
    const onDeactivatedCallback = props.onDeactivatedCallback;

    let classes = item.getItemClasses({
        highlightOnHover: props.highlightOnHover,
        hoverBackgroundStyle: props.hoverBackgroundStyle,
        cursor: props.cursor,
        clickable: props.clickable,
        showItemActionsOnHover: props.showItemActionsOnHover,
    });
    if (props.attrs && props.attrs.className) {
        classes += ` ${props.attrs.className}`;
    }
    if (props.className) {
        classes += ` ${props.className}`;
    }

    const attrs = item.getItemAttrs(props);
    const handlers = getItemEventHandlers(item, props);
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback && onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );

    const ItemTag: keyof JSX.IntrinsicElements = isFullGridSupport() ? 'div' : 'tr';
    let columns;

    if (props._showOnlyFixedColumns) {
        columns = item.getColumns().filter((_, index) => {
            return index < item.getStickyColumnsCount() + +item.hasMultiSelectColumn();
        });
    } else {
        columns = item.getColumns();
    }

    const itemContent = (
        <FocusRoot
            as={ItemTag}
            {...attrs}
            {...handlers}
            onDeactivated={onDeactivated}
            className={classes}
            ref={$wasabyRef}
            key={`${props.keyPrefix}-${item.key}`}
        >
            {columns.map((column) => {
                return (
                    <CellWrapper
                        {...clearProps}
                        column={column}
                        readOnly={props.readOnly}
                        wasabyContext={context}
                        key={column.getInstanceId()}
                    />
                );
            })}
        </FocusRoot>
    );

    // Ниже необходимо использовать именно clearProps, т.к. в createElement объединяются события, навешенные в wml
    // (доступные в scope $wasabyRef) и события из props
    // (добавляемые ядром, чтобы работали подписки на нативные события HTML).
    // В результате подписки на события (например, на onclick) срабатывают по два раза.
    if (props.item.shouldWrapInScrollGroup(props.isSticked)) {
        return (
            <StickyGroup position={props.item.getStickyGroupPosition(props.stickyCallback)}>
                {itemContent}
            </StickyGroup>
        );
    } else {
        return itemContent;
    }
}

export default React.memo(Item);

export function propsCompatibility(props: IItemProps & IPropsCompatibility): void {
    if (props.itemData) {
        props.item = props.itemData;
    }
}
