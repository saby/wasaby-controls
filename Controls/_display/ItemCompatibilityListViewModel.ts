/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { CrudEntityKey } from 'Types/source';

/**
 * Слой совместимости с ListViewModel для элемента коллекции
 * @private
 */

export interface IItemCompatibilityListViewModel {
    item: {};
    key: string | number;
    metaData: {};
}

export function getValidItemKeyAttribute(key: CrudEntityKey): string {
    // У записи ключ может быть null. Например, добавляемая по месту запись.
    // Чтобы этот ключ добавился в атрибут его нужно привести к строке.
    return String(key);
}

export class ItemCompatibilityListViewModel implements IItemCompatibilityListViewModel {
    get item(): {} {
        // Когда вызывается destroy, то сперва дестроится getContents, а после этого item
        // Но typeof this.item сперва вызывает item, а потом только срабатывает typeof, из-за этого падает ошибка
        if (this.destroyed) {
            return undefined;
        }
        return this.getContents();
    }

    get key() {
        if (this.destroyed) {
            return undefined;
        }
        // Актуально для рута в дереве
        if (this.item === null) {
            return null;
        }
        let item = this.item;
        if (item instanceof Array) {
            item = item[item.length - 1];
        }
        const keyOrItem = item?.getKey ? item.getKey() : item;
        let prefix = '';
        if (this.isAdd) {
            prefix += 'adding-';
        }
        return prefix ? `${prefix}${keyOrItem}` : keyOrItem;
    }

    get itemKeyAttribute(): string {
        return getValidItemKeyAttribute(this.key);
    }

    get metaData() {
        if (this.destroyed) {
            return undefined;
        }
        return this.getOwner().getMetaData();
    }

    get searchValue() {
        if (this.destroyed) {
            return undefined;
        }
        return this.getOwner().getSearchValue();
    }

    get index(): number {
        if (this.destroyed) {
            return undefined;
        }
        return this.getOwner().getIndex(this);
    }
}
