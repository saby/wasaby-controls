/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';

import { createElement, delimitProps, useContent } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { FocusArea, FocusRoot, IFocusChangedConfig } from 'UICore/Focus';
import { useTouches as getTouches } from 'UICommon/Events';
import { TemplateFunction } from 'UICommon/Base';

import { StickyBlock } from 'Controls/stickyBlock';
import { Highlight } from 'Controls/baseDecorator';
import { CollectionItem, IItemPadding } from 'Controls/display';
import { Model } from 'Types/entity';
import IItemTemplateOptions from 'Controls/_baseList/interface/ItemTemplate';
import IBaseItemTemplateOptions from 'Controls/_baseList/interface/BaseItemTemplate';
import { ICheckboxMarkerOptions } from 'Controls/checkbox';
import ListMarker from './Marker/ListMarker';
import DraggingCounterTemplate from 'Controls/_baseList/Render/DraggingCounterTemplate';
import { ItemActionsTemplateSelector } from 'Controls/_baseList/Render/ItemActions';
import type { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';

import { TouchDetect } from 'EnvTouch/EnvTouch';
import { TTagStyle } from 'Controls/interface';
import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';

export type TItemEventHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    item: CollectionItem | Model
) => void;
export type TItemDeactivatedHandler = (item: CollectionItem, options: IFocusChangedConfig) => void;

export interface IItemContentTemplateWrapper {
    children: JSX.Element[];
    contentClasses: string;
    href?: string;
}

export interface IItemEventHandlers {
    onMouseOverCallback?: TItemEventHandler;
    onMouseEnterCallback?: TItemEventHandler;
    onMouseLeaveCallback?: TItemEventHandler;
    onMouseMoveCallback?: TItemEventHandler;
    onMouseDownCallback?: TItemEventHandler;
    onMouseUpCallback?: TItemEventHandler;
    onClickCallback?: TItemEventHandler;
    onDeactivatedCallback?: TItemDeactivatedHandler;
    onContextMenuCallback?: TItemEventHandler;
    onSwipeCallback?: TItemEventHandler;
    onLongTapCallback?: TItemEventHandler;
    onWheelCallback?: TItemEventHandler;
    onItemTouchMoveCallback?: TItemEventHandler;
    onContextMenu?: TItemEventHandler;
    onClick?: TItemEventHandler;
    onDoubleClick?: TItemEventHandler;
    onMouseDown?: TItemEventHandler;
    onMouseUp?: TItemEventHandler;
    onMouseLeave?: TItemEventHandler;
    onMouseEnter?: TItemEventHandler;
    onMouseMove?: TItemEventHandler;
    onTouchStart?: TItemEventHandler;
    onTouchEnd?: TItemEventHandler;
    onWheel?: TItemEventHandler;
    onKeyDown?: TItemEventHandler;
}

export interface ITagTemplateProps {
    /**
     * @cfg {String} Стиль для цветных индикаторов в ячейке.
     * @demo Controls-demo/list_new/TagStyleProperty/Index
     */
    tagStyle: TTagStyle;
    onTagClick?: (event: React.BaseSyntheticEvent, item: CollectionItem) => void;
    onTagHover?: (event: React.BaseSyntheticEvent, item: CollectionItem) => void;
}

export interface IItemTemplateProps<
    TContents extends Model = Model,
    TItem extends CollectionItem<TContents> = CollectionItem<TContents>,
> extends IItemTemplateOptions,
        IBaseItemTemplateOptions,
        TInternalProps,
        IItemEventHandlers,
        IItemActionsHandler,
        ITagTemplateProps {
    item: TItem;
    itemData?: TItem;
    itemVersion: number;
    keyPrefix: string;
    className?: string;

    children?: JSX.Element;
    contentTemplate?: TemplateFunction;

    itemActionsTemplate: React.FunctionComponent | React.ReactElement;

    subPixelArtifactFix: boolean;
    pixelRatioBugFix: boolean;
    fixedPositionInitial: string;

    style: string;
    theme: string;
    readOnly: boolean;
    isAdaptive?: boolean;

    // TODO надо разбираться, явно такой опции на itemTemplate нет
    horizontalPadding: unknown;

    contentOverflow?: string;
    // Дырки для дерева
    beforeContentRender?: React.ReactElement;
    afterContentRender?: React.ReactElement;
    contentTemplateProps?: object;
    href?: string;

    decorationStyle?: 'master' | 'default';
}

function HighlightedContentComponent({
    item,
    displayProperty,
}: Pick<IItemTemplateProps, 'item' | 'displayProperty'>): JSX.Element {
    return createElement(Highlight, {
        highlightedValue: item.getSearchValue(),
        value: String(item.getDisplayValue(displayProperty)),
    });
}

export function getItemEventHandlers<TItem extends CollectionItem | Model = CollectionItem | Model>(
    item: TItem,
    props: IItemEventHandlers
): Partial<React.DOMAttributes<HTMLDivElement>> {
    const isTouch = TouchDetect.getInstance().isTouch();

    // react на тач устройствах по тапу вызывает mouse события.
    // Скипаем эти события, т.к. у нас логика не завязано на такое поведение.
    const handlers = {
        onMouseOver: (event) => {
            if (!isTouch) {
                props.onMouseOverCallback?.(event, item);
            }
        },
        onMouseEnter: (event) => {
            if (!isTouch) {
                props.onMouseEnter?.(event, item);
                props.onMouseEnterCallback?.(event, item);
            }
        },
        onMouseLeave: (event) => {
            if (!isTouch) {
                props.onMouseLeave?.(event, item);
                props.onMouseLeaveCallback?.(event, item);
            }
        },
        onDoubleClick: (event) => {
            props.onDoubleClick?.(event, item);
        },
        onKeyDown: (event) => {
            props.onKeyDown?.(event, item);
        },
        onTouchStart: null,
        onTouchMove: null,
        onTouchEnd: null,
    };

    [
        'onMouseMove',
        'onMouseDown',
        'onMouseUp',
        'onClick',
        'onContextMenu',
        'onWheel',
        'onMouseOver',
    ].forEach((eventName) => {
        handlers[eventName] = (event) => {
            props[eventName]?.(event, item);
            props[`${eventName}Callback`]?.(event, item);
        };
    });

    // Нельзя вызывать хуки под условием, т.к. при перерисовках кол-во вызовов хуков должно быть одно и тоже.
    // Есть кейсы когда isTouch меняется. Например, компьютеры с тачмониторами и ZinFrame.
    const swipeHandler = (event, direction) => {
        const wasabyEvent = touches.createWasabySwipeEvent(event, direction);
        props.onSwipeCallback?.(wasabyEvent, item);
    };
    const longTapHandler = (event) => {
        const wasabyEvent = touches.createWasabyLongTapEvent(event);
        props.onLongTapCallback?.(wasabyEvent, item);
    };
    const touches = getTouches(swipeHandler, longTapHandler);
    handlers.onTouchStart = (event) => {
        props.onTouchStart?.(event, item);
        return touches.handleTouchStart(event);
    };
    handlers.onTouchMove = (event) => {
        props.onItemTouchMoveCallback?.(event, item);
        return touches.handleTouchMove(event);
    };
    handlers.onTouchEnd = (event) => {
        props.onTouchEnd?.(event, item);
        return touches.handleTouchEnd(event);
    };
    return handlers;
}

function ItemTemplateWrapper(props: IItemContentTemplateWrapper): JSX.Element {
    const { href, contentClasses, children } = props;
    const ItemWrapperTag: keyof JSX.IntrinsicElements = href ? 'a' : 'div';
    let classes = contentClasses;
    classes += href ? 'tw-block controls-ListView__itemV_href ' : '';
    return (
        <ItemWrapperTag href={href ? href : null} className={classes}>
            {children}
        </ItemWrapperTag>
    );
}

type IMultiSelectTemplateProps = ICheckboxMarkerOptions &
    TInternalProps & {
        item?: CollectionItem;
        baseline?: string;
        style?: string;
        theme?: string;
        forwardedRef?: React.ForwardedRef<HTMLDivElement>;
    };

// createElement - React хук useElement, его нельзя использовать под условием.
function MultiSelect(props: IMultiSelectTemplateProps = {}): JSX.Element {
    return createElement(
        props.item.getMultiSelectTemplate(),
        {
            item: props.item,
            baseline: props.baseline,
            itemPadding: props.item.getItemPadding(),
            highlightOnHover: false,
            viewMode: 'outlined',
            horizontalPadding: props.style === 'master' ? '3xs' : props.horizontalPadding,
            checkboxStyle: props.checkboxStyle,
            contrastBackground: props.contrastBackground,
            size: props.size,
            theme: props.theme,
            ref: props.forwardedRef,
        },
        props.attrs || {}
    );
}

interface IWasabyContentTemplate {
    item: CollectionItem;
    contentTemplate: string | TemplateFunction | React.ReactElement;
    highlightOnHover?: boolean;
    searchValue: string;
    itemPadding: IItemPadding;
    viewMode: string;
    readOnly: boolean;
    itemActionsTemplate: TemplateFunction | React.ReactElement;
    multiSelectTemplate: TemplateFunction | React.ReactElement;
    decorationStyle?: string;
    wasabyContext?: unknown;
}

// Компонент, позволяющий корректно вывести шаблон contentTemplate через хук useElement.
function WasabyContentTemplate(props: IWasabyContentTemplate): React.ReactElement {
    const contentTemplateProps = { ...props };
    // Удаляем из пропсов прикладной contentTemplate
    delete contentTemplateProps.contentTemplate;
    // Вызываем хук useElement
    return createElement(
        props.contentTemplate,
        contentTemplateProps,
        undefined,
        undefined,
        props.wasabyContext
    );
}

function ItemContentTemplate(props: IItemTemplateProps & { wasabyContext: unknown }): JSX.Element {
    const item = props.item || props.itemData;

    const shouldDisplayCheckbox =
        item.getMultiSelectVisibility() && item.getMultiSelectVisibility() !== 'hidden';
    const multiSelectTemplate = (
        multiSelectProps: ICheckboxMarkerOptions & TInternalProps = {},
        ref?: unknown
    ) => {
        return (
            shouldDisplayCheckbox && (
                <MultiSelect
                    {...multiSelectProps}
                    item={item}
                    forwardedRef={ref}
                    baseline={props.baseline}
                    style={props.decorationStyle}
                    theme={props.theme}
                />
            )
        );
    };

    const multiSelectTemplateContentOption = useContent(
        (multiSelectProps, ref) => {
            return (
                item.getMultiSelectPosition() === 'custom' &&
                multiSelectTemplate(multiSelectProps, ref)
            );
        },
        [item, shouldDisplayCheckbox]
    );

    const tagStyle = item?.getTagStyle(props.tagStyle);
    const onTagClick = React.useCallback(
        (event: React.MouseEvent) => {
            props.onTagClick?.(event, item);
        },
        [item]
    );
    const onTagHover = React.useCallback(
        (event: React.MouseEvent) => {
            props.onTagHover?.(event, item);
        },
        [item]
    );
    const tagTemplate = !!tagStyle ? (
        <TagTemplateReact
            position="topRight"
            tagStyle={tagStyle}
            onClick={onTagClick}
            onMouseEnter={onTagHover}
        />
    ) : null;

    let content;
    if (props.children || props.contentTemplate) {
        content = props.children || (
            <WasabyContentTemplate
                item={item}
                highlightOnHover={props.highlightOnHover}
                searchValue={item.getSearchValue()}
                itemPadding={item.getItemPadding()}
                viewMode={'outlined'}
                readOnly={props.readOnly}
                itemActionsTemplate={props.itemActionsTemplate}
                multiSelectTemplate={multiSelectTemplateContentOption}
                decorationStyle={props.decorationStyle}
                contentTemplate={props.contentTemplate}
                wasabyContext={props.wasabyContext}
                {...props.contentTemplateProps}
            />
        );
    } else if (item.getSearchValue()) {
        content = (
            <HighlightedContentComponent item={item} displayProperty={props.displayProperty} />
        );
    } else {
        content = item.getDisplayValue(props.displayProperty);
    }
    const contentClasses =
        item.getContentClasses(props.shadowVisibility, props.borderVisibility, props.borderStyle) +
        ' ' +
        item.getContentTextStylingClasses(props.fontColorStyle, props.fontSize, props.fontWeight) +
        (props.contentOverflow === 'hidden' ? ' tw-overflow-hidden' : '');
    const contentTemplate = (
        <ItemTemplateWrapper contentClasses={contentClasses} href={props.href}>
            <ListMarker
                item={item}
                className={props.markerClassName}
                marker={props.marker}
                markerSize={props.markerSize}
                markerPosition={props.markerPosition}
            />
            {content}
            {tagTemplate}
            {props.afterContentRender && props.afterContentRender}
        </ItemTemplateWrapper>
    );

    const itemActions =
        item.SupportItemActions &&
        (item.getItemActionsPosition() !== 'custom' || item.shouldDisplaySwipeTemplate()) ? (
            <ItemActionsTemplateSelector
                item={item}
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

    const draggingCounter = item.shouldDisplayDraggingCounter() && (
        <DraggingCounterTemplate itemsCount={item.getDraggedItemsCount()} />
    );

    return (
        <>
            {item.getMultiSelectPosition() !== 'custom' && multiSelectTemplate()}
            {props.beforeContentRender && props.beforeContentRender}
            {contentTemplate}
            {itemActions}
            {draggingCounter}
        </>
    );
}

function ListItem(props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const item = props.item || props.itemData;
    const onDeactivatedCallback = props.onDeactivatedCallback;
    let className = item.getWrapperClasses(
        props.highlightOnHover,
        props.cursor,
        props.backgroundColorStyle,
        props.hoverBackgroundStyle,
        props.showItemActionsOnHover,
        props.isAdaptive
    );
    if (props.className) {
        className += ` ${props.className}`;
    } else if (props.attrs?.className) {
        className += ` ${props.attrs.className}`;
    }

    const { clearProps, context } = delimitProps(props);

    const attrs = item.getItemAttrs?.(props);

    const handlers = getItemEventHandlers(item, props);
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback && onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );

    if (item.isSticked()) {
        return (
            <FocusArea onDeactivated={onDeactivated}>
                <StickyBlock
                    {...handlers}
                    position={item.getStickyHeaderPosition()}
                    mode={'replaceable'}
                    _isIosZIndexOptimized={item.isIosZIndexOptimized()}
                    subPixelArtifactFix={props.subPixelArtifactFix}
                    pixelRatioBugFix={props.pixelRatioBugFix}
                    backgroundStyle={`${item.getBackgroundStyle()}-sticky`}
                    forwardedRef={ref}
                    className={className}
                    stickyAttrs={attrs}
                    wasabyContext={context}
                >
                    <ItemContentTemplate
                        {...(clearProps as IItemTemplateProps)}
                        decorationStyle={clearProps.style}
                        wasabyContext={context}
                    />
                </StickyBlock>
            </FocusArea>
        );
    }

    return (
        <FocusRoot
            as="div"
            {...attrs}
            {...handlers}
            onDeactivated={onDeactivated}
            className={className}
            ref={ref}
        >
            <ItemContentTemplate
                {...(clearProps as IItemTemplateProps)}
                decorationStyle={clearProps.style}
                wasabyContext={context}
            />
        </FocusRoot>
    );
}

export default React.memo(React.forwardRef(ListItem));
