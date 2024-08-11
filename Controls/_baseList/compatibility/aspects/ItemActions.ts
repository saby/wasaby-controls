import * as React from 'react';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import type { default as TBaseControl, IBaseControlOptions } from 'Controls/_baseList/BaseControl';
import { CollectionItem } from 'Controls/display';
import { IItemAction } from 'Controls/interface';

export type TOldBaseControlItemActions = {
    callDeleteItemAction: typeof callDeleteItemAction;
    callDeleteToolbarAction: typeof callDeleteToolbarAction;
};

/*
 * ##############################################################################################
 * В этом файле складываем всё необходимое для работы действий над записью в режиме совместимости
 */

/*
 * Вызывает обработчик действия удаления записи, на которой стоит маркер.
 * (Используется при обработске нажатия клавиши Del)
 */
function callDeleteItemAction(
    event: React.KeyboardEvent,
    control: TBaseControl,
    options: IBaseControlOptions,
    markedKey?: CrudEntityKey | null
): boolean {
    // Пока оставляем для совместимости delete (его используют),
    // но правильно будет использовать remove, чтобы в тулбаре и в itemActions
    // идентификаторы совпадали.
    const REMOVE_ACTION_KEYS = ['delete', 'remove'];
    const model = control.getViewModel();
    let item: CollectionItem<Model>;
    let deleteAction;

    // For single marked item we should call ItemAction handler.
    if (markedKey !== null && markedKey !== undefined) {
        item = model.getItemBySourceKey(markedKey);
        let itemActions = item.getActions();
        // Если itemActions были не проинициализированы, то пытаемся их проинициализировать
        if (!itemActions) {
            if (options.itemActionsVisibility !== 'visible') {
                // Пока делаем вызов приватного метода из BaseControl,
                // иначе необходимо тащить за собой половину кода.
                // Поменять, когда в BaseControl не останется ItemActions.
                control._updateItemActions(options);
            }
            itemActions = item.getActions();
        }
        if (itemActions) {
            deleteAction = itemActions.all.find((itemAction: IItemAction) => {
                return (
                    itemAction.id === REMOVE_ACTION_KEYS[0] ||
                    itemAction.id === REMOVE_ACTION_KEYS[1]
                );
            });
            // Имитируем клик по действию 'delete'
            if (deleteAction) {
                // Пока делаем вызов приватного метода из BaseControl,
                // иначе необходимо тащить за собой половину кода.
                // Поменять, когда в BaseControl не останется ItemActions.
                control._handleItemActionClick(deleteAction, event, item, false);
                event.stopPropagation();
                return true;
            }
        }
    }
    return false;
}

/*
 * Отправляет wasaby-событие в Browser.
 * (Используется при обраьотске нажатия клавиши Del)
 */
function callDeleteToolbarAction(options: IBaseControlOptions): void {
    options.notifyCallback(
        'onCallListAction',
        [
            {
                id: 'remove',
                actionName: 'Controls/actions:Remove',
            },
        ],
        {
            bubbling: true,
        }
    );
}

export const OldBaseControlItemActions: TOldBaseControlItemActions = {
    callDeleteItemAction,
    callDeleteToolbarAction,
};
