import * as React from 'react';
import { CheckboxMarker } from 'Controls/checkbox';
import {
    IActionsProps,
    IBorderProps,
    ICheckboxProps,
    IMarkerProps,
    IZenProps,
    IRoundAnglesProps,
    IShadowProps,
    ICursorProps,
} from 'Controls/interface';
import { createElement } from 'UICore/Jsx';
import 'css!Controls-Templates/itemTemplates';
import { TInternalProps } from 'UICore/executor';
import {
    getItemEventHandlers,
    IItemTemplateProps,
    IItemEventHandlers,
    IItemActionsHandler,
    ItemActionsTemplateSelector,
} from 'Controls/baseList';
import { CollectionItem } from 'Controls/display';
import { TemplateFunction } from 'UI/base';

/**
 * Интерфейс для опций контрола {@link Controls-Templates/BaseItem}.
 * @interface Controls-Templates/IBaseItemProps
 * @implements Controls/interface/IMarkerProps
 * @implements Controls/interface/ICheckboxProps
 * @implements Controls/interface/IShadowProps
 * @implements Controls/interface/IBorderProps
 * @implements Controls/interface/IRoundAnglesProps
 * @implements Controls/interface/ICursorProps
 * @public
 */
export interface IBaseItemProps
    extends TInternalProps,
        IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IActionsProps,
        IRoundAnglesProps,
        IItemEventHandlers,
        IItemActionsHandler,
        IItemTemplateProps,
        IZenProps,
        ICursorProps {
    /**
     * @cfg {string} Классы, которые применяются к элементу.
     */
    className?: string;

    /**
     * @cfg {React.ReactNode} Контент элемента.
     */
    children?: React.ReactNode;
    content?: TemplateFunction;
    style?: React.CSSProperties;
    item?: CollectionItem;
    isEditing?: boolean;
}

function getItemClassName({
    className = '',
    cursor = 'pointer',
    shadowVisibility = 'hidden',
    actionsVisibility = 'hidden',
    checkboxVisibility = 'hidden',
    borderVisibility = 'hidden',
    borderStyle = 'default',
    roundAngleBL = 'null',
    roundAngleBR = 'null',
    roundAngleTL = 'null',
    roundAngleTR = 'null',
}: IBaseItemProps): string {
    let classes = className;

    // Для работы скролла и свайпа
    classes += ' controls-ListView__itemV js-controls-ListView__measurableContainer';

    classes += ' Controls-Templates-BaseItem__wrapper';
    if (actionsVisibility !== 'hidden') {
        classes += ' controls-ListView__item_showActions';
    }
    classes += ` controls-cursor_${cursor}`;
    classes += ` Controls-Templates-BaseItem__shadow_${shadowVisibility}`;

    classes += ` Controls-Templates-BaseItem__checkbox-visibility_${checkboxVisibility}`;

    classes += ` Controls-Templates-BaseItem__border-visibility_${borderVisibility}`;
    classes += ` Controls-Templates-BaseItem__border-style_${borderStyle}`;

    classes += ` Controls-Templates-BaseItem__borderRadius-tr_${roundAngleTR}`;
    classes += ` Controls-Templates-BaseItem__borderRadius-tl_${roundAngleTL}`;
    classes += ` Controls-Templates-BaseItem__borderRadius-br_${roundAngleBR}`;
    classes += ` Controls-Templates-BaseItem__borderRadius-bl_${roundAngleBL}`;

    return classes;
}

function getContentClasses({ faded = false }): string {
    let classes = '';

    classes += ' Controls-Templates-BaseItem__content';
    classes += faded ? ' controls-ListView__itemContent_faded ' : '';

    return classes;
}

function getMarkerClassName({
    markerSize = 'content-xs',
    paddingTop = 'm',
}: IBaseItemProps): string {
    let classes = ` Controls-Templates-BaseItem__content_padding-top_${paddingTop}`;
    classes += ` Controls-Templates-BaseItem__marker Controls-Templates-BaseItem__marker_size_${markerSize}`;
    return classes;
}

function getCheckboxClassName({ checkboxValue }: ICheckboxProps): string {
    return `js-controls-ListView__checkbox
     Controls-Templates-BaseItem__checkbox
     Controls-Templates-BaseItem__checkbox_${checkboxValue ? 'selected' : 'unselected'}`;
}

function ItemActionsTemplate(props): React.ReactElement {
    let itemActionsClass = 'controls-inlineheight-l';
    if (props.actionsClassName) {
        itemActionsClass += ` ${props.actionsClassName}`;
    } else {
        itemActionsClass += ' controls-itemActionsV_position_topRight';
    }
    if (props.shadowVisibility && props.shadowVisibility !== 'hidden') {
        itemActionsClass += ` Controls-Templates-BaseItem__itemActionsV_shadow_${props.shadowVisibility}`;
    }
    if (props.viewMode !== 'filled') {
        itemActionsClass += ' controls-itemActionsV_padding-null';
    }

    const actionStyle = props.actionStyle || 'default';
    return props.item?.SupportItemActions &&
        (props.actionsPosition !== 'custom' || props.item?.shouldDisplaySwipeTemplate()) ? (
        <ItemActionsTemplateSelector
            item={props.item}
            highlightOnHover={props.highlightOnHover}
            hoverBackgroundStyle={actionStyle}
            editingStyle={actionStyle}
            iconStyle={props.iconStyle}
            actionsVisibility={props.actionsVisibility}
            itemActionsClass={itemActionsClass}
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
}

// content для обратной совместимости с wasaby
const Content = (props) => {
    return createElement(props.content);
};

export function BaseItem(props: IBaseItemProps): React.ReactElement<IBaseItemProps> {
    const propsWithDefaults = {
        ...props,
        actionsVisibility: props.actionsVisibility || 'hidden',
        checkboxVisibility: props.checkboxVisibility || 'hidden',
    };

    let attrs = {};
    let handlers;
    let isEditing: boolean;
    // FIXME Плитка не должна зависить от наших моделей.
    if (props.item && props.item['[Controls/_display/CollectionItem]']) {
        attrs = props.item.getItemAttrs(props);
        handlers = getItemEventHandlers(props.item, props);
        isEditing = props.item.isEditing();
    }
    const shouldDisplayItemActions =
        propsWithDefaults.actionsVisibility !== 'hidden' &&
        (isEditing || propsWithDefaults.actions?.length);
    return (
        <div
            className={getItemClassName(props)}
            {...attrs}
            style={typeof props.style === 'object' ? props.style : null}
            ref={props.$wasabyRef}
            onMouseEnter={handlers?.onMouseEnter}
            onMouseLeave={handlers?.onMouseLeave}
            onMouseMove={handlers?.onMouseMove}
            onMouseDown={handlers?.onMouseDown}
            onMouseUp={handlers?.onMouseUp}
            onClick={handlers?.onClick}
            onContextMenu={handlers?.onContextMenu}
            onWheel={handlers?.onWheel}
            onTouchStart={handlers?.onTouchStart}
            onTouchMove={handlers?.onTouchMove}
            onTouchEnd={handlers?.onTouchEnd}
        >
            {propsWithDefaults.checkboxVisibility !== 'hidden' ? (
                <div className={getCheckboxClassName(props)}>
                    <CheckboxMarker
                        value={props.checkboxValue}
                        triState={true}
                        className={props.checkboxClassName}
                    />
                </div>
            ) : null}
            {shouldDisplayItemActions ? (
                <ItemActionsTemplate
                    item={props.item}
                    actionsVisibility={propsWithDefaults.actionsVisibility}
                    actionsPosition={props.actionsPosition}
                    onActionsMouseEnter={props.onActionsMouseEnter}
                    onActionMouseDown={props.onActionMouseDown}
                    onActionMouseUp={props.onActionMouseUp}
                    onActionMouseEnter={props.onActionMouseEnter}
                    onActionMouseLeave={props.onActionMouseLeave}
                    onActionClick={props.onActionClick}
                    onItemActionSwipeAnimationEnd={props.onItemActionSwipeAnimationEnd}
                    itemActionsTemplateMountedCallback={props.itemActionsTemplateMountedCallback}
                    itemActionsTemplateUnmountedCallback={
                        props.itemActionsTemplateUnmountedCallback
                    }
                    shadowVisibility={props.shadowVisibility}
                    highlightOnHover={props.highlightOnHover}
                    actionStyle={props.actionStyle}
                    actionsClassName={props.actionsClassName}
                />
            ) : null}
            <div className={getContentClasses(props)}>
                {props.markerVisible ? <div className={getMarkerClassName(props)}></div> : null}
                {props.children ? props.children : null}
                {!props.children && props.content ? <Content content={props.content} /> : null}
            </div>
        </div>
    );
}

export default React.memo(BaseItem);

/**
 * Базовый шаблон элемента. Поддерживает общие для элементов списков настройки. Необходимо передать контент.
 * @class Controls-Templates/BaseItem
 * @implements Controls-Templates/IBaseItemProps
 * @public
 * @demo Controls-Templates-demo/BaseItem/Index
 */
