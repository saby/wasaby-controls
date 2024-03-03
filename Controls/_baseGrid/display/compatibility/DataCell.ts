/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import DataRow from '../DataRow';

/**
 * Совместимость нового интерфейса ячеек со старым
 * @private
 */
export default abstract class DataCellCompatibility<T> {
    get item(): T {
        return this.getOwner().contents;
    }

    isActive(): boolean {
        return this.getOwner().isActive();
    }

    get searchValue() {
        return this.getOwner().searchValue;
    }

    get column() {
        return this._$column;
    }

    get index() {
        return this.getOwner().index;
    }

    abstract getOwner(): DataRow;
}
