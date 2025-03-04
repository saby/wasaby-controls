import type { Direction } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';

/* TODO. Должно стать Differ-ом Navigation
 *  Реализация должна быть другая. Сейчас временная - минимально работающая
 *  ReturnType: INavigationChanges[] / см. IListChanges
 * */
export class NavigationDiffer {
    static resolveChanges({
        newItems,
        loadKey,
        direction,
        hasMoreStorage,
    }: {
        hasMoreStorage?: IHasMoreStorage;
        loadKey: CrudEntityKey | null;
        newItems: RecordSet;
        direction: Direction;
    }): IHasMoreStorage | undefined {
        const more = newItems.getMetaData().more;
        if (typeof more === 'boolean') {
            return {
                ...hasMoreStorage,
                [`${loadKey}`]: {
                    backward:
                        direction === 'up'
                            ? more
                            : hasMoreStorage?.[`${loadKey}`]?.backward ?? false,
                    forward:
                        direction === 'down'
                            ? more
                            : hasMoreStorage?.[`${loadKey}`]?.forward ?? false,
                },
            };
        }

        return hasMoreStorage;
    }
}
