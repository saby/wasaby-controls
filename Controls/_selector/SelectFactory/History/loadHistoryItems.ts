import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { DataSet } from 'Controls/dataSource';
import { ISelectorTabConfig } from 'Controls/_selector/interfaces/ISelector';
import { IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { Serializer } from 'UI/State';
import { IHistoryItem } from 'Controls/HistoryStore';

export interface IHistoryLoadResult {
    items: RecordSet;
    pinnedKeys: CrudEntityKey[];
}

const MAX_HISTORY_ITEMS = 12;

function getHistoryKeys(historyItems: RecordSet<IHistoryItem> | null): CrudEntityKey[] {
    const historyItemsKeys = [] as CrudEntityKey[];
    historyItems?.each((item) => {
        const itemData = JSON.parse(item.get('ObjectId') as string, new Serializer().deserialize);
        historyItemsKeys.push(itemData);
    });
    return historyItemsKeys;
}

export async function loadHistoryItems(
    tabConfig: ISelectorTabConfig,
    listResults: Record<string, IListDataFactoryLoadResult>,
    listName: CrudEntityKey
): Promise<IHistoryLoadResult | null> {
    const historyId = tabConfig.historyConfig?.historyId;
    if (historyId) {
        if (tabConfig.historyConfig?.loader) {
            const historyLoadResult = await Loader.load({
                historyData: tabConfig.historyConfig?.loader,
            });
            return historyLoadResult.historyData as IHistoryLoadResult;
        } else {
            const { Store } = (await loadAsync(
                'Controls/HistoryStore'
            )) as typeof import('Controls/HistoryStore');
            const { recent, pinned } = await Store.load(historyId, { recent: MAX_HISTORY_ITEMS });
            const recentKeys = getHistoryKeys(recent);
            const pinnedKeys = getHistoryKeys(pinned);
            const { filter, keyProperty, sourceController } = listResults[listName];
            let queryFilter;
            if (tabConfig.historyConfig?.getMethod === 'meta') {
                queryFilter = {
                    ...filter,
                    _historyIds: [historyId],
                };
            } else {
                queryFilter = {
                    ...filter,
                    [keyProperty as string]: recentKeys,
                };
            }
            const dataSet = new DataSet({
                source: sourceController?.getSource(),
                keyProperty,
                filter: queryFilter,
            });
            return {
                items: (await dataSet.load()) as RecordSet,
                pinnedKeys,
            };
        }
    }
    return Promise.resolve(null);
}
