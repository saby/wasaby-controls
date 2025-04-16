import type {
    IListState,
    IListDataFactoryLoadResult,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/list';
import { RecordSet, List } from 'Types/collection';
import { Model } from 'Types/entity';
import { TKey } from 'Controls/interface';
import { factory } from 'Types/chain';
import { getKeysByItems } from 'Controls/_lookupPopup/Container';

export interface ICompatibleSelectSliceArgs extends IListDataFactoryArguments {
    selectedItems?: List<Model> | RecordSet;
    selectionFilter?: (item: Model) => boolean;
    multiSelect?: boolean;
}

function getSelectedKeys(config: ICompatibleSelectSliceArgs): TKey[] {
    if (config.selectedKeys) {
        return config.selectedKeys;
    } else if (config.selectedItems?.getCount()) {
        const filteredItems = factory(config.selectedItems)
            .filter(config.selectionFilter || (() => true))
            .value();
        return getKeysByItems(filteredItems, config.keyProperty);
    } else {
        return [];
    }
}

export default function initState(
    _loadResult: IListDataFactoryLoadResult,
    config: ICompatibleSelectSliceArgs
): Partial<IListState> {
    const state: Partial<IListState> = {};
    const selectedKeys = getSelectedKeys(config);

    if (!config.multiSelect && selectedKeys.length === 1) {
        state.markedKey = selectedKeys[0];
    }
    state.selectedKeys = selectedKeys;

    return state;
}
