import type { TKey, ISelection } from 'Controls-DataEnv/interface';
import type { IListState } from '../interface/IListState';

import { CounterController, ICounterControllerOptions } from 'Controls/multiselection';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { LibPaths } from 'Controls-DataEnv/staticLoader';
import { getLoadDirection } from './source';
import { ISelectionObject } from 'Controls-DataEnv/listTypes';

function getCounterController(state: IListState): CounterController {
    const { CounterController } = loadSync<typeof import('Controls/multiselection')>(
        LibPaths.MultiSelection
    );

    const counterController = new CounterController({
        ...state,
        rootKey: null,
        hasMoreUtil: (key: TKey) => {
            return (
                !!state.sourceController &&
                (state.sourceController.hasMoreData(
                    getLoadDirection('up', state.itemsOrder),
                    key
                ) ||
                    state.sourceController.hasMoreData(
                        getLoadDirection('down', state.itemsOrder),
                        key
                    ))
            );
        },
        isLoadedUtil: (key: TKey) => {
            return !state.sourceController || state.sourceController.hasLoaded(key);
        },
    } as unknown as ICounterControllerOptions);

    counterController.setSelection({
        selected: state.selectedKeys,
        excluded: state.excludedKeys,
    });

    return counterController;
}

export function getCount(state: IListState): number {
    return getCounterController(state).getCount();
}

/**
 * Функция возвращает объект с отметкой в списке "selection" для выполнения массовых операций над записями.
 * Функция учитывает особенности массовых операций, такие как:
 * - если в списке не установлено отметки, то операция должна применяться к записи, на которой установлен маркер
 * - если применили команду "Отобрать отмеченные" и в списке нет отмеченных записей, то операция должна применяться ко всем отобранным записям
 * */
export function getListCommandsSelection(
    nextState: IListState,
    selectionBeforeShowSelectedApply?: ISelectionObject
): ISelection | undefined {
    if (isLoaded('Controls/operations')) {
        return loadSync<typeof import('Controls/operations')>(
            'Controls/operations'
        ).getListCommandsSelection(
            { selectedKeys: nextState.selectedKeys, excludedKeys: nextState.excludedKeys },
            nextState.markedKey,
            selectionBeforeShowSelectedApply
        );
    }
}
