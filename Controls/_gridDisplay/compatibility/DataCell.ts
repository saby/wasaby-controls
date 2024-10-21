/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
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
