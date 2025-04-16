import type { TKey } from 'Controls-DataEnv/interface';
import type { IListState } from '../interface/IListState';

import { CounterController, ICounterControllerOptions } from 'Controls/multiselection';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { LibPaths } from 'Controls-DataEnv/staticLoader';
import { getLoadDirection } from './source';

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
