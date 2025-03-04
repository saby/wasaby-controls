/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';
import type { TInternalProps } from 'UICore/Executor';
import type { IItemTemplateProps } from 'Controls/baseList';
import type { IItemActionsTemplateProps } from 'Controls/itemActions';
import { HoverActionsTemplate, ISwipeActionsTemplateProps, hooks } from 'Controls/listsCommonLogic';

// Возвращает функцию для вставки в прикладном коде.
// Функция принимает опции для шаблона операций над записью
export function getItemActionsTemplate(
    itemProps: Partial<IItemTemplateProps>
): React.FunctionComponent<any> {
    return React.forwardRef(
        (itemActionsProps: TInternalProps & Partial<IItemActionsTemplateProps>, _) => {
            const item = itemProps.item || itemProps.itemData;

            const itemActions = hooks.useItemActionsDeferredInitialization({
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
