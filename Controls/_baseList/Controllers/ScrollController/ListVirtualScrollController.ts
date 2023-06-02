/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import {
    AbstractListVirtualScrollController,
    IAbstractListVirtualScrollControllerOptions,
} from './AbstractListVirtualScrollController';

import {
    ObserversController,
    IObserversControllerOptions,
} from './ObserverController/ObserversController';
import {
    ItemsSizeController,
    IItemsSizesControllerOptions,
} from './ItemsSizeController/ItemsSizeController';
import type {
    IDirection,
    IScrollControllerOptions,
} from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import ItemsSizeControllerMultiColumns from 'Controls/_baseList/Controllers/ScrollController/ItemsSizeController/ItemsSizeControllerMultiColumns';
import { getValidatedItemKey } from 'Controls/_baseList/resources/utils/helpers';
import type { TItemKey } from 'Controls/display';

export type IItemsSizesControllerConstructor = new (
    options: IItemsSizesControllerOptions
) => ItemsSizeController;
export type IObserversControllerConstructor = new (
    options: IObserversControllerOptions
) => ObserversController;

export interface IListVirtualScrollControllerOptions
    extends IAbstractListVirtualScrollControllerOptions {
    /**
     * Флаг который означает, что записи в списке расположены в несколько столбцов.
     */
    multiColumns: boolean;
}

export class ListVirtualScrollController extends AbstractListVirtualScrollController {
    private readonly _multiColumns: boolean;

    constructor(options: IListVirtualScrollControllerOptions) {
        super(options);

        this._multiColumns = options.multiColumns;

        if (this._multiColumns) {
            this.setForwardTriggerPosition('offset');
        }
    }

    resetItems(): void {
        super.resetItems();

        // В многоколоночном списке последняя строка может быть не заполнена, чтобы этой проблемы не было
        // нижний триггер сразу отображаем с оффсетом.
        if (this._multiColumns) {
            this.setForwardTriggerPosition('offset');
        }
    }

    protected _getObserversControllerConstructor(): IObserversControllerConstructor {
        return ObserversController;
    }

    protected _getItemsSizeControllerConstructor(
        options: IListVirtualScrollControllerOptions
    ): IItemsSizesControllerConstructor {
        return options.multiColumns
            ? ItemsSizeControllerMultiColumns
            : ItemsSizeController;
    }

    protected _getScrollControllerOptions(
        options: IListVirtualScrollControllerOptions
    ): IScrollControllerOptions {
        return {
            ...super._getScrollControllerOptions(options),
            virtualScrollConfig: {
                ...options.virtualScrollConfig,
                calcByOffset:
                    options.virtualScrollConfig.calcByOffset ||
                    options.multiColumns,
            },
        };
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirection
    ): void {
        this._collection.setIndexes(startIndex, endIndex, shiftDirection);
    }

    protected _getCollectionItemsCount(): number {
        return this._collection ? this._collection.getCount() : 0;
    }

    protected _getIndexByKey<T extends TItemKey = TItemKey>(key: T): number {
        return this._collection ? this._collection.getIndexByKey(key) : -1;
    }

    protected _validateEdgeItem(itemKey: string): boolean {
        // Из DOM-a ключ мы всегда получаем в виде строки. Если строку можно привести к числу, то делаем это.
        // Чтобы метод getItemBySourceKey корректно отработал.
        const validItemKey = getValidatedItemKey(itemKey);
        const item = this._collection.getItemBySourceKey(validItemKey);
        // Элемента может не быть и мы должны взять следующий подходящий элемент.
        // Это может произойти например после удаления или перезагрузки списка с восстановлением скролла.
        return !!item && item.VirtualEdgeItem;
    }
}
