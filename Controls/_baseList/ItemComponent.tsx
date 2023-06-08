/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';

import {
    createElement,
    delimitProps,
    useContent,
    wasabyAttrsToReactDom,
} from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { IFocusChangedConfig, useFocusCallbacks } from 'UICore/Focus';
import { useTouches as getTouches } from 'UICommon/Events';
import { TemplateFunction } from 'UICommon/Base';

import { StickyBlock } from 'Controls/stickyBlock';
import { Highlight } from 'Controls/baseDecorator';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import IItemTemplateOptions from 'Controls/_baseList/interface/ItemTemplate';
import IBaseItemTemplateOptions from 'Controls/_baseList/interface/BaseItemTemplate';
import { ICheckboxMarkerOptions } from 'Controls/checkbox';
import ListMarker from './Marker/ListMarker';
import DraggingCounterTemplate from 'Controls/_baseList/Render/DraggingCounterTemplate';
import {
    ItemActionsTemplateSelector,
    IItemActionsHandler,
} from 'Controls/_baseList/Render/ItemActions';
import { TouchDetect } from 'EnvTouch/EnvTouch';

export type TItemEventHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    item: CollectionItem | Model
) => void;
export type TItemDeactivatedHandler = (
    item: CollectionItem,
    options: IFocusChangedConfig
) => void;

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
    onEditArrowClick?: TItemEventHandler;
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

export interface IItemTemplateProps<
    TContents extends Model = Model,
    TItem extends CollectionItem<TContents> = CollectionItem<TContents>
> extends IItemTemplateOptions,
        IBaseItemTemplateOptions,
        TInternalProps,
        IItemEventHandlers,
        IItemActionsHandler {
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
}

export function getItemEventHandlers<
    TItem extends CollectionItem | Model = CollectionItem | Model
>(
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
        onMouseMove: (event) => {
            props.onMouseMove?.(event, item);
            props.onMouseMoveCallback?.(event, item);
        },
        onMouseDown: (event) => {
            props.onMouseDown?.(event, item);
            props.onMouseDownCallback?.(event, item);
        },
        onMouseUp: (event) => {
            props.onMouseUp?.(event, item);
            props.onMouseUpCallback?.(event, item);
        },
        onClick: (event) => {
            props.onClick?.(event, item);
            props.onClickCallback?.(event, item);
        },
        onContextMenu: (event) => {
            props.onContextMenu?.(event, item);
            props.onContextMenuCallback?.(event, item);
        },
        onDoubleClick: (event) => {
            props.onDoubleClick?.(event, item);
        },
        onWheel: (event) => {
            props.onWheel?.(event, item);
            props.onWheelCallback?.(event, item);
        },
        onKeyDown: (event) => {
            props.onKeyDown?.(event, item);
        },
        onTouchStart: null,
        onTouchMove: null,
        onTouchEnd: null,
    };

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

export function getItemAttrs(
    item: CollectionItem,
    props: IItemTemplateProps
): Record<string, unknown> {
    const userAttrs = { ...props.attrs };
    // Зачистим атрибут class иначе он перекроет className при серверном рендеринге
    delete userAttrs.className;
    // Это не нужно вешать на див.
    // Правильнее нужно убрать спред аттрибутов, но вешают различные кастомные атрибуты, например для тестов
    delete userAttrs['ws-delegates-tabfocus'];
    delete userAttrs['ws-creates-context'];
    return {
        ...userAttrs,
        'attr-data-qa': `key-${item.key}`,
        'data-qa': userAttrs['data-qa'] || item.listElementName,
        'item-key': item.itemKeyAttribute,
        style: wasabyAttrsToReactDom(userAttrs).style,
    };
}

function ItemContentTemplate(
    props: IItemTemplateProps & { wasabyContext: unknown }
): JSX.Element {
    const item = props.item || props.itemData;

    const shouldDisplayCheckbox =
        item.getMultiSelectVisibility() &&
        item.getMultiSelectVisibility() !== 'hidden';
    const multiSelectTemplate = (
        multiSelectProps: ICheckboxMarkerOptions & TInternalProps = {}
    ) => {
        return (
            shouldDisplayCheckbox &&
            createElement(
                item.getMultiSelectTemplate(),
                {
                    item,
                    baseline: props.baseline,
                    itemPadding: item.getItemPadding(),
                    highlightOnHover: false,
                    viewMode: 'outlined',
                    horizontalPadding:
                        props.style === 'master'
                            ? '3xs'
                            : multiSelectProps.horizontalPadding,
                    checkboxStyle: multiSelectProps.checkboxStyle,
                    contrastBackground: multiSelectProps.contrastBackground,
                    size: multiSelectProps.size,
                    theme: props.theme,
                },
                multiSelectProps.attrs || {}
            )
        );
    };

    const multiSelectTemplateContentOption = useContent(
        (multiSelectProps) => {
            return (
                item.getMultiSelectPosition() === 'custom' &&
                multiSelectTemplate(multiSelectProps)
            );
        },
        [item, shouldDisplayCheckbox]
    );

    let content;
    if (props.children || props.contentTemplate) {
        content =
            props.children ||
            createElement(
                props.contentTemplate,
                {
                    item,
                    highlightOnHover: props.highlightOnHover,
                    searchValue: item.getSearchValue(),
                    itemPadding: item.getItemPadding(),
                    viewMode: 'outlined',
                    readOnly: props.readOnly,
                    itemActionsTemplate: props.itemActionsTemplate,
                    multiSelectTemplate: multiSelectTemplateContentOption,
                    ...props.contentTemplateProps,
                },
                undefined,
                undefined,
                props.wasabyContext
            );
    } else if (item.getSearchValue()) {
        content = createElement(Highlight, {
            highlightedValue: item.getSearchValue(),
            value: String(item.getDisplayValue(props.displayProperty)),
        });
    } else {
        content = item.getDisplayValue(props.displayProperty);
    }
    const contentClasses =
        item.getContentClasses(
            props.shadowVisibility,
            props.borderVisibility,
            props.borderStyle
        ) +
        ' ' +
        item.getContentTextStylingClasses(
            props.fontColorStyle,
            props.fontSize,
            props.fontWeight
        ) +
        (props.contentOverflow === 'hidden' ? ' tw-overflow-hidden' : '');
    const contentTemplate = (
        <div className={contentClasses}>
            <ListMarker
                item={item}
                className={props.markerClassName}
                marker={props.marker}
                markerSize={props.markerSize}
                markerPosition={props.markerPosition}
            />
            {content}
            {props.afterContentRender && props.afterContentRender}
        </div>
    );

    const itemActions =
        item.SupportItemActions &&
        (item.getItemActionsPosition() !== 'custom' ||
            item.shouldDisplaySwipeTemplate()) ? (
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
                onItemActionSwipeAnimationEnd={
                    props.onItemActionSwipeAnimationEnd
                }
                itemActionsTemplateMountedCallback={
                    props.itemActionsTemplateMountedCallback
                }
                itemActionsTemplateUnmountedCallback={
                    props.itemActionsTemplateUnmountedCallback
                }
            />
        ) : null;

    const draggingCounter = item.shouldDisplayDraggingCounter() && (
        <DraggingCounterTemplate itemsCount={item.getDraggedItemsCount()} />
    );

    return (
        <>
            {item.getMultiSelectPosition() !== 'custom' &&
                multiSelectTemplate()}
            {props.beforeContentRender && props.beforeContentRender}
            {contentTemplate}
            {itemActions}
            {draggingCounter}
        </>
    );
}

function ListItem(
    props: IItemTemplateProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const item = props.item || props.itemData;
    let className = item.getWrapperClasses(
        props.highlightOnHover,
        props.cursor,
        props.backgroundColorStyle,
        props.hoverBackgroundStyle,
        props.showItemActionsOnHover,
        props.isAdaptive
    );
    if (props.attrs?.className) {
        className += ` ${props.attrs.className}`;
    }
    if (props.className) {
        className += ` ${props.className}`;
    }

    const { clearProps, context } = delimitProps(props);

    const attrs = getItemAttrs(item, props);

    const handlers = getItemEventHandlers(item, props);
    const resultRef = useFocusCallbacks(
        {
            onDeactivated: (options) => {
                return (
                    props.onDeactivatedCallback &&
                    props.onDeactivatedCallback(item, options)
                );
            },
        },
        ref as (element: HTMLElement) => void
    );

    if (item.isSticked()) {
        return (
            <StickyBlock
                {...handlers}
                position={item.getStickyHeaderPosition()}
                mode={'replaceable'}
                _isIosZIndexOptimized={item.isIosZIndexOptimized()}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                backgroundStyle={`${item.getBackgroundStyle()}-sticky`}
                $wasabyRef={resultRef}
                className={className}
                stickyAttrs={attrs}
                wasabyContext={context}
            >
                <ItemContentTemplate
                    {...(clearProps as IItemTemplateProps)}
                    wasabyContext={context}
                />
            </StickyBlock>
        );
    }

    return (
        <div {...attrs} {...handlers} className={className} ref={resultRef}>
            <ItemContentTemplate
                {...(clearProps as IItemTemplateProps)}
                wasabyContext={context}
            />
        </div>
    );
}

export default React.memo(React.forwardRef(ListItem));
