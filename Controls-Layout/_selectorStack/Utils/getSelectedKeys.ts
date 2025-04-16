import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';

export const getSelectedKeysFromSlice = (
    storeId: string,
    selectedItems: Record<string, RecordSet<Model>>
): TKey[] => {
    const newSelectedKeys: TKey[] = [];
    selectedItems[storeId].each((item) => {
        newSelectedKeys.push(item.getKey());
    });
    return newSelectedKeys;
};
