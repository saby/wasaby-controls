import {
    ListVirtualScrollController,
    IListVirtualScrollControllerOptions,
    IDirectionNew,
    IScrollControllerOptions,
    IPlaceholders,
    IAbstractObserversControllerConstructor,
    TVirtualScrollMode,
    IItemsSizesControllerConstructor,
} from 'Controls/baseList';
import ColumnsCollection from 'Controls/_columns/display/Collection';
import { CrudEntityKey } from 'Types/source';
import { ColumnObserversController } from 'Controls/_columns/controllers/ColumnObserversController';
import { COLUMN_SELECTOR } from '../Constants';
import ColumnItemsSizeController from './ColumnItemsSizeController';

export interface IColumnVirtualScrollControllerOptions
    extends IListVirtualScrollControllerOptions {
    column: number;
}

export default class ColumnVirtualScrollController extends ListVirtualScrollController {
    private _column: number;

    constructor(options: IColumnVirtualScrollControllerOptions) {
        this._column = options.column;
        super(options);
    }

    updateTriggers(): void {
        this._scrollController.updateTriggers();
    }

    destroy(): void {
        (this._collection as ColumnsCollection).setColumnPlaceholders(
            this._column,
            null
        );
        super.destroy();
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirectionNew
    ): void {
        // инициализируем итератор по всем записям, чтобы с помощью него itemActions посчитались на новых записях
        this._setCollectionIterator();
        (this._collection as ColumnsCollection).setColumnRange(this._column, {
            startIndex,
            endIndex,
        });
    }

    protected _getCollectionItemsCount(): number {
        return (this._collection as ColumnsCollection).getItemsCountInColumns(
            this._column
        );
    }

    protected _getIndexByKey<T extends CrudEntityKey = CrudEntityKey>(
        key: T
    ): number {
        const collectionIndex = (
            this._collection as ColumnsCollection
        ).getIndexByKey(key);
        return (this._collection as ColumnsCollection).getIndexInColumnByIndex(
            collectionIndex
        );
    }

    protected _getScrollControllerOptions(
        options: IColumnVirtualScrollControllerOptions
    ): IScrollControllerOptions {
        return {
            ...super._getScrollControllerOptions(options),
            placeholdersChangedCallback: (
                placeholders: IPlaceholders
            ): void => {
                (this._collection as ColumnsCollection).setColumnPlaceholders(
                    this._column,
                    placeholders
                );
                // backward зануляем, т.к. плэйсхолдер занимает реальное место и
                // виртуального плейсхолдера сверху нет
                this._scheduleUpdatePlaceholders({
                    backward: 0,
                    forward: placeholders.forward,
                });
            },
        };
    }

    protected _getObserversControllerConstructor(): IAbstractObserversControllerConstructor {
        return ColumnObserversController;
    }

    protected _getItemsSizeControllerConstructor(): IItemsSizesControllerConstructor {
        return ColumnItemsSizeController;
    }

    protected _getItemsSelector(
        selector: string,
        virtualScrollMode: TVirtualScrollMode
    ): string {
        const itemsSelector = selector.replace(
            COLUMN_SELECTOR,
            `${COLUMN_SELECTOR}_${this._column}`
        );
        return super._getItemsSelector(itemsSelector, virtualScrollMode);
    }

    protected _getTriggersSelector(selector: string): string {
        return `${COLUMN_SELECTOR}_${this._column} > ${selector}`;
    }
}
