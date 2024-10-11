/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { CollectionItem } from 'Controls/display';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import type { IItemTemplateProps } from 'Controls/_baseList/ItemComponent';
import {
    IAction,
    IItemActionsObject,
    IItemActionsTemplateProps,
    ItemActionsTemplate,
    SwipeActionsTemplate as SwipeActionsTemplateBase,
} from 'Controls/itemActions';
import type { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';
import { useItemActionsDeferredInitialization } from 'Controls/_baseList/Render/hooks/useItemActionsDeferredInitialization';

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

// Компонент, который рендерит операции над записью по ховеру или по свайпу в плоском списке и в табличном представлении
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
    let itemActionsClass = props.item.getItemActionPositionClasses(
        actionsTemplateConfig.itemActionsPosition,
        props.itemActionsClass
    );
    itemActionsClass += ` ${props.item.getItemActionClasses(
        actionsTemplateConfig.itemActionsPosition
    )}`;

    const hoverBackgroundStyle =
        props.hoverBackgroundStyle || props.item.getHoverBackgroundStyle() || props.item.getStyle();
    const editingStyle = props.editingStyle || actionsTemplateConfig.editingStyle;
    return (
        <ItemActionsTemplate
            ref={ref}
            {...actionsTemplateConfig}
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

// Возвращает функцию для вставки в прикладном коде.
// Функция принимает опции для шаблона операций над записью
export function getItemActionsTemplate(
    itemProps: Partial<IItemTemplateProps>
): React.FunctionComponent<any> {
    return React.forwardRef(
        (itemActionsProps: TInternalProps & Partial<IItemActionsTemplateProps>, _) => {
            const item = itemProps.item || itemProps.itemData;

            const itemActions = useItemActionsDeferredInitialization({
                item,
                itemActionsTemplateMountedCallback: itemProps.itemActionsTemplateMountedCallback,
                itemActionsTemplateUnmountedCallback:
                    itemProps.itemActionsTemplateUnmountedCallback,
            });

            // TODO Вроде передача highlightOnHover=false прямо на itemActionsTemplate - это странно.
            //  Скорее всего, тут надо им задавать правильный цвет в getItemActionsBackgroundClass
            //  Вот по этой ошибке буду решать проблемы с фонами операций над записью:
            //  https://online.sbis.ru/opendoc.html?guid=dda9c7e8-4c78-485a-b45f-3436f74c6424&client=3
            const shouldHighlightOnHover =
                itemActionsProps.highlightOnHover !== undefined
                    ? itemActionsProps.highlightOnHover
                    : itemProps.highlightOnHover;
            // Большинство пропсов берётся из скоупа именно шаблона записи, а не itemActionsTemplate
            return (
                <HoverActionsTemplate
                    item={item}
                    viewMode={itemActionsProps.viewMode}
                    menuActionVisibility={itemActionsProps.menuActionVisibility}
                    showedActions={itemActions}
                    itemActionsClass={
                        itemActionsProps.itemActionsClass || itemProps.itemActionsClass
                    }
                    hoverBackgroundStyle={itemProps.hoverBackgroundStyle}
                    actionsVisibility={itemProps.actionsVisibility}
                    actionPadding={itemActionsProps.actionPadding}
                    highlightOnHover={shouldHighlightOnHover}
                    itemActionsBackgroundStyle={itemActionsProps.itemActionsBackgroundStyle}
                    attrs={itemActionsProps.attrs}
                    theme={itemProps.theme}
                    onActionsMouseEnter={itemProps.onActionsMouseEnter}
                    onActionMouseDown={itemProps.onActionMouseDown}
                    onActionMouseUp={itemProps.onActionMouseUp}
                    onActionMouseEnter={itemProps.onActionMouseEnter}
                    onActionMouseLeave={itemProps.onActionMouseLeave}
                    onActionClick={itemProps.onActionClick}
                />
            );
        }
    );
}

// Выжимает пропсы, которые нужны для ItemActions по свайпу
export function extractSwipeActionProps<T extends ISwipeActionsTemplateProps>(
    props: T
): ISwipeActionsTemplateProps {
    return {
        highlightOnHover: props.highlightOnHover,
        itemActionsClass: props.itemActionsClass,
        hoverBackgroundStyle: props.hoverBackgroundStyle,
        actionsVisibility: props.actionsVisibility,
        itemActionsBackgroundStyle: props.itemActionsBackgroundStyle,
        onActionsMouseEnter: props.onActionsMouseEnter,
        onActionMouseDown: props.onActionMouseDown,
        onActionMouseUp: props.onActionMouseUp,
        onActionMouseEnter: props.onActionMouseEnter,
        onActionMouseLeave: props.onActionMouseLeave,
        onItemActionSwipeAnimationEnd: props.onItemActionSwipeAnimationEnd,
        onActionClick: props.onActionClick,
        itemActionsTemplate: props.itemActionsTemplate,
        swipeTemplate: props.swipeTemplate,
    };
}
