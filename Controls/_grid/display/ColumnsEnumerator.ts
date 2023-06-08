/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import type Grid from './mixins/Grid';
import type { TColumns } from './interface/IColumn';
import type Cell from './Cell';

export interface IColumnsEnumerable {
    getColumnsEnumerator(): IColumnsEnumerator;
    setColumnsEnumerator(enumerator: IColumnsEnumerator): void;
}

export interface IColumnsEnumerator {
    getColumnsConfig(columns?: TColumns): TColumns;
    getColumns<T extends Cell = Cell>(
        columnItems: T[],
        hasRowTemplate: boolean
    ): T[];
}

export class ColumnsEnumerator implements IColumnsEnumerator {
    private readonly _collection: Grid;

    constructor(collection: Grid) {
        this._collection = collection;
    }

    getColumns<T extends Cell = Cell>(columnItems: T[]): T[] {
        return columnItems;
    }

    getColumnsConfig(
        columns: TColumns = this._collection.getGridColumnsConfig()
    ): TColumns {
        return columns;
    }
}
