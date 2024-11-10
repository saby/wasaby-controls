import { Model } from 'Types/entity';
import { TKey } from 'Controls-DataEnv/interface';

export function hasItemInArray(items: Model[], key: TKey | undefined): boolean {
    return !!items.find((item) => item.getKey() === key);
}

export function getNextItemFromArray(items: Model[], key: TKey): Model | undefined {
    const currentIndexByKey = items.findIndex((item) => {
        return item.getKey() === key;
    });
    return currentIndexByKey !== -1 ? items[currentIndexByKey + 1] : undefined;
}
