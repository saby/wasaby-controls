// Компонент, который рендерит операции над записью по ховеру или по свайпу в плоском списке и в табличном представлении
import * as React from 'react';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import {
    IAction,
    IItemActionsObject,
    IItemActionsTemplateProps,
    ItemActionsTemplate,
    SwipeActionsTemplate as SwipeActionsTemplateBase,
} from 'Controls/itemActions';
import { useItemActionsDeferredInitialization } from './hook/useItemActionsDeferredInitialization';
import type { IItemActionsHandler } from 'Controls/baseList';
import type { TInternalProps } from 'UICore/Executor';
import type { CollectionItem } from 'Controls/display';

export interface IHoverActionsTemplateProps
    extends IItemActionsTemplateProps,
        IItemActionsHandler,
        TInternalProps {
    item: CollectionItem;
    showedActions: IAction[];
}

export interface ISwipeActionsTemplateProps extends IHoverActionsTemplateProps {
    item: CollectionItem;
    showedActions: IAction[];
}

export interface IItemActionsTemplateSelectorProps
    extends IItemActionsTemplateProps,
        TInternalProps,
        IItemActionsHandler {
    item: CollectionItem;
    itemData?: CollectionItem;
    itemActions?: IItemActionsObject;
}

export function ItemActionsTemplateSelector(
    props: IItemActionsTemplateSelectorProps
): React.ReactElement | null {
    const item = props.item || props.itemData;

    const itemActions = useItemActionsDeferredInitialization({
        item,
        itemActionsTemplateMountedCallback: props.itemActionsTemplateMountedCallback,
        itemActionsTemplateUnmountedCallback: props.itemActionsTemplateUnmountedCallback,
    });

    const editingConfig = item.getEditingConfig();
    const hasEditingActions =
        item.isEditing() && (!editingConfig || editingConfig.toolbarVisibility === true);
    if (!itemActions.length && !hasEditingActions) {
        return null;
    }

    if (props.item.isSwiped()) {
        return (
            <SwipeActionsTemplate
                item={item}
                showedActions={itemActions}
                itemActionsClass={props.itemActionsClass}
                hoverBackgroundStyle={props.hoverBackgroundStyle}
                actionsVisibility={props.actionsVisibility}
                highlightOnHover={props.highlightOnHover}
                editingStyle={props.editingStyle}
                itemActionsPosition={props.itemActionsPosition}
                itemActionsBackgroundStyle={props.itemActionsBackgroundStyle}
                onActionsMouseEnter={props.onActionsMouseEnter}
                onActionMouseDown={props.onActionMouseDown}
                onActionMouseUp={props.onActionMouseUp}
                onActionMouseEnter={props.onActionMouseEnter}
                onActionMouseLeave={props.onActionMouseLeave}
                onItemActionSwipeAnimationEnd={props.onItemActionSwipeAnimationEnd}
                onActionClick={props.onActionClick}
            />
        );
    }

    if (props.item.getItemActionsPosition() !== 'custom') {
        return (
            <HoverActionsTemplate
                item={item}
                showedActions={itemActions}
                itemActionsClass={props.itemActionsClass}
                hoverBackgroundStyle={props.hoverBackgroundStyle}
                iconStyle={props.iconStyle}
                actionsVisibility={props.actionsVisibility}
                itemActionsPosition={props.itemActionsPosition}
                highlightOnHover={props.highlightOnHover}
                itemActionsBackgroundStyle={props.itemActionsBackgroundStyle}
                onActionsMouseEnter={props.onActionsMouseEnter}
                onActionMouseDown={props.onActionMouseDown}
                onActionMouseUp={props.onActionMouseUp}
                onActionMouseEnter={props.onActionMouseEnter}
                onActionMouseLeave={props.onActionMouseLeave}
                onActionClick={props.onActionClick}
            />
        );
    }

    return null;
}

// Компонент, который рендерит шаблон операций над записью по свайпу
export function SwipeActionsTemplate(props: ISwipeActionsTemplateProps): JSX.Element {
    // При деактивации свайпа зануляется swipeConfig, который содержит
    // коллбеки для рассчёта необходимости отрисовки иконки и необходимости отрисовки заголовка кнопки.
    // Если после того, как мы сбросили конфиг произойдёт перерисовка списка,
    // реакт попытается  отрендерить этот компонент без коллбеков и упадёт с ошибкой в консоль.
    const swipeConfig = props.item.getOwner().getSwipeConfig();
    if (!TouchDetect.getInstance().isTouch() || !swipeConfig) {
        return null;
    }

    const hoverBackgroundStyle =
        props.hoverBackgroundStyle || props.item.getHoverBackgroundStyle() || props.item.getStyle();

    const actionsTemplateConfig = props.item.getOwner().getActionsTemplateConfig();
    return (
        <SwipeActionsTemplateBase
            {...actionsTemplateConfig}
            {...swipeConfig}
            itemActionsPosition={
                props.itemActionsPosition || actionsTemplateConfig.itemActionsPosition
            }
            showedActions={props.showedActions || props.item.getActions().showed}
            swipeAnimation={props.item.getSwipeAnimation()}
            theme={props.item.getTheme()}
            style={props.item.getStyle()}
            isSwiped={props.item.isSwiped()}
            isEditing={props.item.isEditing()}
            actionsVisibility={props.actionsVisibility}
            actionMode={props.actionMode}
            applyButtonStyle={props.item.getEditingConfig()?.applyButtonStyle}
            actionPadding={props.actionPadding}
            actionStyle={props.actionStyle}
            highlightOnHover={props.highlightOnHover}
            hoverBackgroundStyle={hoverBackgroundStyle}
            hasActionWithIcon={props.item.hasActionWithIcon()}
            itemActionsClass={props.itemActionsClass}
            iconStyle={props.iconStyle}
            itemActionsBackgroundStyle={props.itemActionsBackgroundStyle}
            onActionsMouseEnter={(event) => {
                return props.onActionsMouseEnter?.(event, props.item);
            }}
            onActionMouseDown={(event, action) => {
                return props.onActionMouseDown?.(event, action, props.item);
            }}
            onActionMouseUp={(event, action) => {
                return props.onActionMouseUp?.(event, action, props.item);
            }}
            onActionMouseEnter={(event, action) => {
                return props.onActionMouseEnter?.(event, action, props.item);
            }}
            onActionMouseLeave={(event, action) => {
                return props.onActionMouseLeave?.(event, action, props.item);
            }}
            onActionClick={(event, action) => {
                return props.onActionClick?.(event, action, props.item);
            }}
            onActionsAnimationEnd={props.onItemActionSwipeAnimationEnd}
        />
    );
}

// Компонент, который рендерит шаблон операций над записью по ховеру
export const HoverActionsTemplate = React.forwardRef(function HoverActionsTemplate(
    props: IHoverActionsTemplateProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    if (!props.item.shouldDisplayItemActions()) {
        return null;
    }

    const actionsTemplateConfig = props.item.getOwner().getActionsTemplateConfig(props);
    const itemActionsPosition =
        props.itemActionsPosition || actionsTemplateConfig.itemActionsPosition;
    let itemActionsClass = props.item.getItemActionPositionClasses(
        itemActionsPosition,
        props.itemActionsClass
    );
    itemActionsClass += ` ${props.item.getItemActionClasses(itemActionsPosition)}`;

    const hoverBackgroundStyle =
        props.hoverBackgroundStyle || props.item.getHoverBackgroundStyle() || props.item.getStyle();
    const editingStyle = props.editingStyle || actionsTemplateConfig.editingStyle;
    return (
        <ItemActionsTemplate
            ref={ref}
            {...actionsTemplateConfig}
            itemActionsPosition={itemActionsPosition}
            attrs={props.attrs}
            highlightOnHover={props.highlightOnHover}
            itemActionsBackgroundStyle={props.itemActionsBackgroundStyle}
            actionsVisibility={props.actionsVisibility}
            hoverBackgroundStyle={hoverBackgroundStyle}
            editingStyle={editingStyle}
            itemActionsClass={itemActionsClass}
            iconStyle={props.iconStyle}
            actionMode={props.actionMode}
            applyButtonStyle={props.item.getEditingConfig()?.applyButtonStyle}
            actionPadding={props.actionPadding}
            actionStyle={props.actionStyle}
            theme={props.item.getTheme()}
            style={props.item.getStyle()}
            isEditing={props.item.isEditing()}
            isSwiped={props.item.isSwiped()}
            viewMode={props.viewMode}
            menuActionVisibility={props.menuActionVisibility}
            showedActions={props.showedActions || props.item.getActions()?.showed || []}
            onActionsMouseEnter={(event) => {
                return props.onActionsMouseEnter?.(event, props.item);
            }}
            onActionMouseDown={(event, action) => {
                return props.onActionMouseDown?.(event, action, props.item);
            }}
            onActionMouseUp={(event, action) => {
                return props.onActionMouseUp?.(event, action, props.item);
            }}
            onActionClick={(event, action) => {
                return props.onActionClick?.(event, action, props.item);
            }}
            onActionMouseEnter={(event, action) => {
                return props.onActionMouseEnter?.(event, action, props.item);
            }}
            onActionMouseLeave={(event, action) => {
                return props.onActionMouseLeave?.(event, action, props.item);
            }}
        />
    );
});
