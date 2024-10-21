import * as React from 'react';
import { Component } from 'react';
import { ISelectionObject, TKey } from 'Controls/interface';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import type { Model } from 'Types/entity';
import type { ISliceWithSelection, ListSlice } from 'Controls/dataFactory';
import type { default as IBaseAction } from './BaseAction';
import type { IRouter } from 'Router/router';

interface IExecuteToolbarActionParams {
    action: IBaseAction;
    toolbarItem: Model;
    clickEvent: React.MouseEvent;
    slice?: ListSlice;
    toolbarSelectedKeys?: TKey[];
    opener?: Component | HTMLElement;
    router?: IRouter;
    storeId?: string;
    selection?: ISelectionObject;
    container?: HTMLElement;
    toolbarMenuItemClick?: boolean;
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

export async function executeActionAsync(
    props: Omit<IExecuteToolbarActionParams, 'selection'> &
        Required<Pick<IExecuteToolbarActionParams, 'slice'>>
): Promise<boolean> {
    const selection = await (props.slice as unknown as ISliceWithSelection).getSelection();

    if (
        !selection.marked.length &&
        !selection.excluded.length &&
        props.slice.state.listCommandsSelection
    ) {
        selection.marked = props.slice.state.listCommandsSelection.selected;
        selection.excluded = props.slice.state.listCommandsSelection.excluded;
    }

    return executeAction({
        ...props,
        selection: {
            selected: selection.marked,
            excluded: selection.excluded,
            recursive: selection.recursive,
        },
    });
}

export function executeAction(props: IExecuteToolbarActionParams) {
    const {
        action,
        toolbarItem,
        clickEvent,
        slice,
        toolbarSelectedKeys,
        storeId,
        opener,
        router,
        selection,
        container,
        toolbarMenuItemClick,
    } = props;
    const canExecuteAction = action?.canExecute(toolbarItem, clickEvent);
    let listState = {};
    let executeSelection = selection;
    if (slice?.['[IListSlice]']) {
        const state = slice.state;
        const isEmptySelection = !state.selectedKeys.length && !state.excludedKeys?.length;

        if (!executeSelection) {
            if (
                isEmptySelection &&
                action?.isAllowEmptySelection() &&
                state.selectionViewMode !== 'selected'
            ) {
                executeSelection = {
                    selected: state.parentProperty ? [state.root] : [null],
                    excluded: state.parentProperty ? [state.root] : [null],
                };
            } else {
                executeSelection = state.listCommandsSelection;
            }
        }

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
        return action?.execute({
            action,
            toolbarItem,
            target: clickEvent.target,
            event: clickEvent,
            toolbarSelectedKeys,
            opener,
            router,
            storeId,
            ...listState,
            container,
            selection: executeSelection,
            toolbarMenuItemClick,
        });
    }
    return canExecuteAction;
}
