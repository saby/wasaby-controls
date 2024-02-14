import {
    ListVirtualScrollController,
    IListVirtualScrollControllerOptions,
    IDirectionNew,
    IAbstractObserversControllerConstructor,
    IItemsSizesControllerConstructor,
    ItemsSizeControllerMultiColumns,
    IItemsSizes,
    IPlaceholders,
    IScheduledScrollParams,
} from 'Controls/baseList';
import ColumnsCollection from 'Controls/_columns/display/Collection';
import { CrudEntityKey } from 'Types/source';
import { ColumnObserversController } from 'Controls/_columns/controllers/ColumnObserversController';
import { COLUMN_SELECTOR } from '../Constants';

interface IOptions extends IListVirtualScrollControllerOptions {
    column: number;
}

export default class ColumnVirtualScrollController extends ListVirtualScrollController<IOptions> {
    private _newPlaceholder: number;

    updateTriggers(): void {
        this._scrollController.updateTriggers();
    }

    getItemsSizes(): IItemsSizes {
        return this._scrollController.getItemsSizes();
    }

    getPlaceholders(): IPlaceholders {
        return this._scrollController.getPlaceholders();
    }

    getContentSizeBeforeList(): number {
        return this._scrollController.getContentSizeBeforeList();
    }

    setItemsContainer(itemsContainer: HTMLElement): void {
        super.setItemsContainer(itemsContainer);
        this._scrollController.updateItemsSizes();
    }

    destroy(): void {
        super.destroy();
        if (!this._collection.isDestroyed()) {
            (this._collection as ColumnsCollection).setColumnPlaceholder(
                this._options.column,
                null
            );
        }
    }

    setNewColumnPlaceholder(placeholder: number) {
        this._newPlaceholder = placeholder;
    }

    endBeforeUpdateListControl(): void {
        super.endBeforeUpdateListControl();
        this._collection.setColumnPlaceholder(this._options.column, this._newPlaceholder);
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirectionNew
    ): void {
        // инициализируем итератор по всем записям, чтобы с помощью него itemActions посчитались на новых записях
        this._setCollectionIterator();
        (this._collection as ColumnsCollection).setColumnRange(
            this._options.column,
            {
                startIndex,
                endIndex,
            },
            shiftDirection
        );
    }

    protected _getCollectionItemsCount(): number {
        return (this._collection as ColumnsCollection).getItemsCountInColumns(this._options.column);
    }

    protected _getIndexByKey<T extends CrudEntityKey = CrudEntityKey>(key: T): number {
        const collectionIndex = (this._collection as ColumnsCollection).getIndexByKey(key);
        return (this._collection as ColumnsCollection).getIndexInColumnByIndex(collectionIndex);
    }

    protected _getObserversControllerConstructor(): IAbstractObserversControllerConstructor {
        return ColumnObserversController;
    }

    protected _getItemsSizeControllerConstructor(): IItemsSizesControllerConstructor {
        return ItemsSizeControllerMultiColumns;
    }

    protected _getTriggersSelector(selector: string): string {
        return `${COLUMN_SELECTOR}_${this._options.column} > ${selector}`;
    }

    protected _scheduleScroll(scrollParams: IScheduledScrollParams): void {
        if (
            scrollParams.type === 'calculateRestoreScrollParams' &&
            scrollParams.params.offset === undefined
        ) {
            // При восстановлении скролла нужно учесть размер плейсхолдера в колонке,
            // т.к. если сместился диапазон, то плейсхолдер тоже изменится по высоте.
            // Оффсет считаем всю высоту текущего плейсхолдера в ДОМ-е,
            // т.к. восстанавливать скролл всегда будет колонка, у которой плейсхолдер стал 0.
            // То есть получаем, что offset = currentPlaceholderSize - 0.
            // Плейсхолдеры пересчитываются во время применения нового диапазона,
            // новый диапазон применяется до _scheduleScroll,
            // поэтому getColumnPlaceholder вернет уже новый размер плейсхолдера.
            // Менять порядок вызовов небезопасно, т.к. это повлияет на все списки и непонятно как.
            const placeholderInDOM = this._collection.getColumnPlaceholder(this._options.column);
            scrollParams.params = {
                ...scrollParams.params,
                offset: placeholderInDOM * -1,
            };
        }
        super._scheduleScroll(scrollParams);
    }
}
