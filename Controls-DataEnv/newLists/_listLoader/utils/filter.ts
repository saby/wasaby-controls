import type { TKey, TSourceOption, TFilter } from 'Controls-DataEnv/interface';
import type { Direction } from 'Controls-DataEnv/listTypes';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { getOriginalSource } from 'Controls/dataSource';
import type { IData, ICrud, ICrudPlus } from 'Types/source';

interface IPrepareFilterProps {
    filter?: TFilter;
    expandedItems?: TKey[];
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    source?: TSourceOption;
    parentProperty?: string;
    root?: TKey;
    nextRoot?: TKey;
    direction?: Direction;
    deepScrollLoad?: boolean;
}

export function prepareFilterWithExpandedItems(
    filter: Record<string, unknown>,
    expandedItems: TKey[],
    parentProperty: string,
    root?: TKey
): Record<string, unknown> {
    const resultFilter = { ...filter };

    if (expandedItems?.length && expandedItems[0] !== null) {
        if (!Array.isArray(resultFilter[parentProperty])) {
            resultFilter[parentProperty] = [];
        }

        const uniqueItems = new Set(resultFilter[parentProperty] as TKey[]);

        if (root !== undefined) {
            uniqueItems.add(root);
        }

        expandedItems.forEach((key) => uniqueItems.add(key));
        resultFilter[parentProperty] = Array.from(uniqueItems);
    } else if (root !== undefined) {
        resultFilter[parentProperty] = root;
    }

    return resultFilter;
}

export async function prepareFilterForQuery(
    props: IPrepareFilterProps
): Promise<Record<string, unknown>> {
    const {
        expandedItems,
        root = null,
        source,
        selectedKeys,
        parentProperty,
        direction,
        deepScrollLoad,
        nextRoot = null,
        excludedKeys = [],
        filter = {},
    } = props;
    const isLoadToDirectionWithExpandedItems = direction && deepScrollLoad;
    const isDeepReload = (!direction || isLoadToDirectionWithExpandedItems) && root === nextRoot;
    let result: Record<string, unknown> = { ...filter };

    if (parentProperty) {
        // Набираем все раскрытые узлы
        if (expandedItems?.length && expandedItems[0] !== null && isDeepReload) {
            result = prepareFilterWithExpandedItems(result, expandedItems, parentProperty, root);
        } else if (root !== undefined) {
            result[parentProperty] = root;
        }

        if (selectedKeys?.length && source) {
            const { selectionToRecord } =
                await loadAsync<typeof import('Controls/operations')>('Controls/operations');
            const originalSource = getOriginalSource(source);

            if (originalSource && isIDataSource(originalSource)) {
                result.entries = selectionToRecord(
                    {
                        selected: selectedKeys,
                        excluded: excludedKeys,
                    },
                    originalSource.getAdapter()
                );
            }
        }
    }

    return result;
}

function isIDataSource(source: TSourceOption): source is ICrud & ICrudPlus & IData {
    return !!(source as IData).getAdapter;
}
