/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
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
} from 'Controls/_listsCommonLogic/scrollController/ScrollController';
import ItemsSizeControllerMultiColumns from 'Controls/_listsCommonLogic/scrollController/ItemsSizeController/ItemsSizeControllerMultiColumns';
import { isValidEdgeItem } from './ScrollUtil';
import type { TItemKey, Collection } from 'Controls/display';

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

export class ListVirtualScrollController<
    TOptions extends IListVirtualScrollControllerOptions = IListVirtualScrollControllerOptions
> extends AbstractListVirtualScrollController<TOptions> {
    private readonly _multiColumns: boolean;

    constructor(options: TOptions) {
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
        options: TOptions
    ): IItemsSizesControllerConstructor {
        return options.multiColumns ? ItemsSizeControllerMultiColumns : ItemsSizeController;
    }

    protected _getScrollControllerOptions(options: TOptions): IScrollControllerOptions {
        return {
            ...super._getScrollControllerOptions(options),
            virtualScrollConfig: {
                ...options.virtualScrollConfig,
                calcByOffset: options.virtualScrollConfig.calcByOffset || options.multiColumns,
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
        return isValidEdgeItem(itemKey, this._collection as unknown as Collection);
    }
}
