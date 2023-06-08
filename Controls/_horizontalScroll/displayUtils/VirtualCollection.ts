/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import type {
    IVirtualCollection,
    IVirtualCollectionItem,
} from 'Controls/baseList';
import type { GridCollection, IColumn } from 'Controls/grid';
import type { TItemKey } from 'Controls/display';
import { ColumnsEnumerator } from './ColumnsEnumerator';
import { VirtualCollectionItem } from './VirtualCollectionItem';
import { Logger } from 'UI/Utils';

const ERROR_MSG = {
    MISSING_COLUMN_KEY:
        'Controls/grid:Collection | Ошибка конфигурации виртуального горизонтального скролла. ' +
        'Не задан ключ колонки! ' +
        'При использовании опции IGridOptions::columnKeyProperty каждой колонке должен быть присвоен уникальный ключ.',
    COLUMN_KEY_DUPLICATED:
        'Controls/grid:Collection | Ошибка конфигурации виртуального горизонтального скролла. ' +
        'Задан неуникальный ключ колонки! ' +
        'При использовании опции IGridOptions::columnKeyProperty каждой колонке должен быть присвоен уникальный ключ.',
};

export class VirtualCollection implements IVirtualCollection {
    private readonly _collection: GridCollection;
    private readonly _columnKeyProperty?: string;
    private _columnItems: IVirtualCollectionItem[];

    constructor(collection: GridCollection, columnKeyProperty?: string) {
        this._collection = collection;
        this._columnKeyProperty = columnKeyProperty;
    }

    validateEdgeItem(key: string): boolean {
        const index = this.getIndexByKey(key);

        // Застиканная колонка не является валидным элементом к xкоторому нужно скроллить при восстановлении позиции.
        return !(
            index !== -1 &&
            this._columnItems[index] &&
            this._columnItems[index].isRenderedOutsideRange()
        );
    }

    at(index: number): IVirtualCollectionItem {
        return this.getItems()[index];
    }

    getCount(): number {
        return this._collection.getColumnsCount();
    }

    getIndexByKey(key: TItemKey): number {
        const stringKey = String(key);
        return this.getItems().findIndex((item) => {
            return String(item.key) === stringKey;
        });
    }

    getItems(): IVirtualCollectionItem[] {
        if (!this._columnItems) {
            this._initItems();
        }
        return this._columnItems;
    }

    getStartIndex(): number {
        return this._getEnumerator().getIndexes().startIndex;
    }

    getStopIndex(): number {
        return this._getEnumerator().getIndexes().endIndex;
    }

    nextVersion(): void {
        this._collection.nextVersion();
    }

    setViewIterator(): void {
        this._collection.setColumnsEnumerator(
            new ColumnsEnumerator(this._collection)
        );
    }

    setIndexes(startIndex: number, endIndex: number): void {
        this._columnItems = null;
        this._getEnumerator().setIndexes(startIndex, endIndex);
    }

    private _getEnumerator(): ColumnsEnumerator {
        return this._collection.getColumnsEnumerator() as ColumnsEnumerator;
    }

    private _initItems(): void {
        const keys: Record<TItemKey, boolean> = {};
        const indexes = this._getEnumerator().getIndexes();
        this._columnItems = this._collection
            .getGridColumnsConfig()
            .map((column, index) => {
                const key = this._getValidColumnKey(column, index, keys);
                return new VirtualCollectionItem({
                    key,
                    index,
                    column,
                    isRenderedOutsideRange:
                        indexes &&
                        indexes.startIndex > 0 &&
                        index < this._collection.getStickyColumnsCount(),
                });
            });
    }

    private _getValidColumnKey(
        column: IColumn,
        index: number,
        keys: Record<TItemKey, boolean>
    ): TItemKey | never {
        let key: TItemKey;
        if (this._columnKeyProperty) {
            if (
                typeof column[this._columnKeyProperty] === 'number' ||
                typeof column[this._columnKeyProperty] === 'string'
            ) {
                key = column[this._columnKeyProperty];
            } else {
                Logger.error(ERROR_MSG.MISSING_COLUMN_KEY);
            }
        } else {
            key = index;
        }

        if (keys[key]) {
            Logger.error(ERROR_MSG.COLUMN_KEY_DUPLICATED);
        }
        keys[key] = true;

        return key;
    }
}
