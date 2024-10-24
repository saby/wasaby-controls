import type { Model } from 'Types/entity';
import type { CrudEntityKey } from 'Types/source';

export function getKey(item: Model | Model[] | string): CrudEntityKey {
    if (item === null) {
        return item;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (item['[Types/_entity/Model]']) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return item.getKey();
    }

    if (item instanceof Array) {
        return getKey(item[item.length - 1]);
    }

    return item as string;
}
