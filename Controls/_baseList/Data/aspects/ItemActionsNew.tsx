import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import { BaseAction } from 'Controls/actions';
import { loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { IGetHandlersProps } from 'Controls/_baseList/Data/IGetHandlersProps';
import { INewListSchemeActionsHandlers } from 'Controls/_baseList/Data/INewListScheme';
import { IAction, ISelectionObject } from 'Controls/interface';
import { addPageDeps } from 'UICommon/Deps';

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
                context: props.context,
                event: nativeEvent,
                container,
                selection: {
                    selected: [item.getKey()],
                    excluded: [],
                },
            });
        },
    };
}

export interface IExecuteActionProps {
    action: BaseAction;
    actionOptions?: object;
    slice: ListSlice;
    context: Record<string | symbol, unknown>;
    event: React.MouseEvent | React.KeyboardEvent;
    container?: HTMLDivElement;
    selection?: ISelectionObject;
}

// Предзагрузка зависимостей ItemActions.
// TODO:
//  1. Когда ItemActions будут на предзагрузке, это надо будет объединить с методом loadListActions.
//  2. Мы пока не можем учесть кейс, когда экшны заданы через itemActionsProperty,
//  потому что все экшны надо предзагрузить до того, как будет проинициализирован контроллер ItemActions.
//  Вариант, как сделать на слайсе: Когда приходят данные, бегать по всем элементам, набирать модули для загрузки,
//  и на _dataLoaded сразу запускать loadListActions. Важно, чтобы это происходило до обновления индексов модели и
//  реинициализации ItemActions.
//  3. Также будут проблемы при ItemActionsVisibility='visible', т.к. ListContainerConnected загружает их позднее чем нужно.
//  Чтобы решить это, единственный вариант - переместить itemActions на предзагрузку.
export function loadActions(listActions: IAction[]): Promise<void> | undefined {
    const modules: string[] = ['Controls/actions'];
    const modulesLoading: Promise<unknown>[] = [loadAsync('Controls/actions')];
    listActions.forEach((actionCfg) => {
        if (actionCfg.actionName && actionCfg.actionName.indexOf('/') !== -1) {
            modules.push(actionCfg.actionName);
            modulesLoading.push(loadAsync(actionCfg.actionName));
        }
    });
    return Promise.all(modulesLoading).then(() => {
        addPageDeps(modules);
    });
}

// Хелпер, вызывающий action как действие тулбара. Тебуется для:
// 1. Запуска действия по клавише на клавиатуре
// 2. Кейса, когда ItemActions заданы как запускаемые действия, аналогично actions тулбара.
export function executeAction({
    action,
    actionOptions,
    slice,
    context,
    event,
    container,
    selection,
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
        action,
        toolbarItem,
        clickEvent,
        slice,
        opener: event.target,
        container,
        selection,
    });
}
