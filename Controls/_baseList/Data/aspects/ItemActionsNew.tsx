import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import { BaseAction } from 'Controls/actions';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { IGetHandlersProps } from 'Controls/_baseList/Data/connector/IGetHandlersProps';
import { INewListSchemeActionsHandlers } from 'Controls/_baseList/Data/INewListScheme';
import { IAction, ISelectionObject } from 'Controls/interface';

/*
 * #######################################################################################################
 * В этом файле складываем всё необходимое для работы действий над записью для списка на схеме со слайсами
 */

export function getHandlers(props: IGetHandlersProps): INewListSchemeActionsHandlers {
    return {
        // Нужно перетаскивать из BaseControl весь каскад методов,
        // обрабатывающих скрытие, показ по ховеру, отображение меню и обработку кликов в ItemActions,
        // а также контроллеры ActionsController и HoverFreeze.
        // Пока обработка спускаемого коллбека для схемы со слайсом - единственный вариант корректно выполнить действие.
        onActionClickNew(
            action: IAction | BaseAction,
            item: Model,
            container: HTMLDivElement,
            nativeEvent: MouseEvent
        ): void {
            // TODO Запись уже отмечена маркером, но нам нужно всё равно передавать selection,
            //  Потому что стейт слайса на момент вызова ещё не применяется.
            //  В итоге мы тут всегда будм получать предыдущее неактуальное выделение.
            //  Надо научиться запускать экшн после применения состояния слайса,
            //  тогда selection тут будет не нужен.
            executeAction({
                action,
                slice: props.slice,
                context: {
                    item,
                },
                event: nativeEvent,
                container,
            });
        },
    };
}

export interface IExecuteActionProps {
    action: BaseAction;
    actionOptions?: object;
    storeId?: string;
    slice: ListSlice;
    context: Record<string | symbol, unknown>;
    event: React.MouseEvent | React.KeyboardEvent;
    container?: HTMLDivElement;
    selection?: ISelectionObject;
}

// Хелпер, вызывающий action как действие тулбара. Тебуется для:
// 1. Запуска действия по клавише на клавиатуре
// 2. Кейса, когда ItemActions заданы как запускаемые действия, аналогично actions тулбара.
// Контекст - это просто объект ключ-значение. Это не обязательно равно какому-либо контексту списка.
export function executeAction({
    action,
    actionOptions,
    slice,
    context,
    event,
    container,
    selection,
    storeId,
}: IExecuteActionProps): void {
    if (!action) {
        return;
    }
    const { executeAction } = loadSync('Controls/actions');
    const clickEvent =
        event.type === 'click'
            ? event
            : new SyntheticEvent(null, {
                  target: event.target,
                  type: 'click',
              });
    const toolbarItem = new Model({
        keyProperty: 'id',
        rawData: {
            ...action.getState(),
            ...actionOptions,
        },
    });
    action.setContext(context);
    return executeAction({
        storeId,
        action,
        toolbarItem,
        clickEvent,
        slice,
        opener: event.target,
        container,
        selection,
    });
}
