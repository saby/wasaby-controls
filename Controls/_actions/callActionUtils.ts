import * as React from 'react';
import { TKey } from 'Controls/interface';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import type { Model } from 'Types/entity';
import type { ListSlice } from 'Controls/dataFactory';
import type { default as IBaseAction } from './BaseAction';
import type { IRouter } from 'Router/router';
import { Component } from 'react';

interface IExecuteToolbarActionParams {
    action: IBaseAction;
    item: Model;
    clickEvent: React.MouseEvent;
    slice?: ListSlice;
    toolbarSelectedKeys?: TKey[];
    opener?: Component | HTMLElement;
    router?: IRouter;
    storeId?: string;
}

const BASE_ACTION_MODULE = 'Controls/actions:BaseAction';

export function createAction(
    actionName: string = BASE_ACTION_MODULE,
    actionOptions: { [p: string]: unknown }
): IBaseAction | undefined {
    if (!isLoaded(actionName)) {
        Logger.error(`ActionsCollection::Во время создания коллекции произошла ошибка.
                                   Action ${actionName} не был загружен до создания коллекции`);
        return;
    }
    const action: IBaseAction = loadSync(actionName);
    return new action(actionOptions);
}

export function executeAction({
    action,
    item,
    clickEvent,
    slice,
    toolbarSelectedKeys,
    storeId,
    opener,
    router,
}: IExecuteToolbarActionParams) {
    const canExecuteAction = action?.canExecute(item, clickEvent);
    let listState = {};
    if (slice?.['[IListSlice]']) {
        const state = slice.state;
        listState = {
            source: state.source,
            filter: state.filter,
            keyProperty: state.keyProperty,
            parentProperty: state.parentProperty,
            sourceController: state.sourceController,
            operationsController: state.operationsController,
            selectedKeysCount: state.count,
            nodeProperty: state.nodeProperty,
            selection: state.listCommandsSelection,
        };
    }
    if (canExecuteAction) {
        action?.execute({
            action,
            toolbarItem: item,
            target: clickEvent.target,
            event: clickEvent,
            toolbarSelectedKeys,
            opener,
            router,
            storeId,
            ...listState,
        });
    }
    return canExecuteAction;
}
