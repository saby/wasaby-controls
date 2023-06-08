/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import type {
    GridCell,
    GridCollection,
    IColumnsEnumerator,
    TColumns,
} from 'Controls/grid';
import type { IItemsRange } from 'Controls/baseList';

const RECALC_CELL_CSS_SELECTOR =
    'controls-Grid__columnScroll__fake-cell-to-recalc-width';
const RECALC_CELL_JS_SELECTOR =
    'js-controls-Grid__virtualColumnScroll__fake-scrollable-cell-to-recalc-width';
const RECALC_FIXED_CELL_JS_SELECTOR =
    'js-controls-Grid__virtualColumnScroll__fake-scrollable-cell-to-recalc-width_fixed';

export interface IVirtualColumnsEnumerator {
    readonly IVirtualColumnsEnumerator: true;
    getColumnIndexByVirtualIndex(index: number): number;
}

export class ColumnsEnumerator
    implements IColumnsEnumerator, IVirtualColumnsEnumerator
{
    readonly IVirtualColumnsEnumerator: true = true;

    protected readonly _collection: GridCollection;
    private _range: IItemsRange;
    private _cashedIndexes: Record<string, number[]> = {};

    constructor(collection: GridCollection) {
        this._collection = collection;
    }

    getIndexes(): IItemsRange {
        return (
            this._range || {
                startIndex: 0,
                endIndex: this._collection.getGridColumnsConfig().length,
            }
        );
    }

    setIndexes(startIndex: number, endIndex: number): void {
        if (
            !this._range ||
            this._range.startIndex !== startIndex ||
            this._range.startIndex !== endIndex
        ) {
            this._range = { startIndex, endIndex };
            this._cashedIndexes = {};
            this._collection.updateColumnsIndexes();
        }
    }

    getColumnsConfig(
        columns: TColumns = this._collection.getGridColumnsConfig(),
        withResizer: boolean = true,
        withSpacer: boolean = true
    ): object[] {
        const hasResizer = withResizer && this._collection.hasResizer();
        const hasSpacer = withSpacer && this._collection.hasSpacingColumn();
        const fullColumns = [...columns];

        if (hasSpacer) {
            fullColumns.push({ width: '1fr' });
        }
        if (hasResizer) {
            fullColumns.splice(this._collection.getStickyColumnsCount(), 0, {
                width: '0px',
            });
        }
        return this._getIndexes(true, hasSpacer, false, hasResizer).map((i) => {
            return fullColumns[i];
        });
    }

    getColumns<T extends GridCell = GridCell>(
        columnItems: T[],
        hasRowTemplate: boolean = false,
        hasResizer: boolean = false
    ): T[] {
        if (hasRowTemplate) {
            return columnItems;
        }

        const hasSpacingColumn = this._collection.hasSpacingColumn();
        const hasItemActionsCell =
            this._collection.hasItemActionsSeparatedCell();
        const result = [];
        let offset = 0;

        if (columnItems[0].CheckBoxCell) {
            result.push(columnItems[0]);
            offset++;
        }
        result.push(
            ...this._getIndexes(
                true,
                hasSpacingColumn,
                hasItemActionsCell,
                hasResizer
            )
                .map((i) => {
                    return columnItems[i + offset];
                })
                .filter((c) => {
                    return !!c;
                })
        );

        return result;
    }

    getColumnsToRecalcWidth(): { key: string | number; className?: string }[] {
        let result: { key: string | number; className?: string }[] = [];
        const stickyColumnsCount = this._collection.getStickyColumnsCount();
        const keyProperty = this._collection.getColumnKeyProperty();

        this._getIndexes(true, false, false).forEach((cellIndex) => {
            let className = `${RECALC_CELL_CSS_SELECTOR} ${RECALC_CELL_JS_SELECTOR}`;

            if (cellIndex < stickyColumnsCount) {
                className += ` ${RECALC_FIXED_CELL_JS_SELECTOR}`;
            }

            const column = this._collection.getGridColumnsConfig()[cellIndex];
            result.push({
                key: keyProperty ? column[keyProperty] : cellIndex,
                className,
            });
        });

        if (this._collection.hasMultiSelectColumn()) {
            result = [
                {
                    key: 'checkbox_column',
                    className: `${RECALC_CELL_CSS_SELECTOR} ${RECALC_FIXED_CELL_JS_SELECTOR}`,
                },
                ...result,
            ];
        }

        if (this._collection.hasItemActionsSeparatedCell()) {
            result = [
                ...result,
                {
                    key: 'itemActionsColumn',
                    className: `${RECALC_CELL_CSS_SELECTOR}`,
                },
            ];
        }

        if (this._collection.hasSpacingColumn()) {
            result = [
                ...result,
                {
                    key: 'spacingColumn',
                    className: `${RECALC_CELL_CSS_SELECTOR}`,
                },
            ];
        }
        return result;
    }

    getColumnIndexByVirtualIndex(index: number): number {
        let sourceIndex = index;

        if (this._range.startIndex > this._collection.getStickyColumnsCount()) {
            sourceIndex +=
                this._range.startIndex -
                this._collection.getStickyColumnsCount();
        }

        return sourceIndex;
    }

    private _getIndexes(
        withSticky: boolean = true,
        useSpacing: boolean = false,
        hasItemActionsCell: boolean = false,
        hasResizer: boolean = false
    ): number[] {
        const key = `${withSticky}-${useSpacing}-${hasItemActionsCell}-${hasResizer}`;
        if (!this._cashedIndexes[key]) {
            this._cashedIndexes[key] = this._initIndexes(
                withSticky,
                useSpacing,
                hasItemActionsCell,
                hasResizer
            );
        }
        return this._cashedIndexes[key];
    }

    private _initIndexes(
        withSticky: boolean,
        useSpacing: boolean,
        hasItemActionsCell: boolean,
        hasResizer: boolean
    ): number[] {
        const indexes = [];
        let offset = 0;

        if (withSticky) {
            for (let i = 0; i < this._collection.getStickyColumnsCount(); i++) {
                indexes.push(i);
            }
        }

        if (hasResizer) {
            indexes.push(this._collection.getStickyColumnsCount());
            offset++;
        }

        for (let i = this._range.startIndex; i < this._range.endIndex; i++) {
            if (indexes.indexOf(i + offset) === -1) {
                indexes.push(i + offset);
            }
        }

        let lastIndex = offset + this._collection.getGridColumnsConfig().length;

        if (hasItemActionsCell) {
            indexes.push(lastIndex);
            lastIndex++;
        }

        if (useSpacing) {
            indexes.push(lastIndex);
            lastIndex++;
        }

        return indexes;
    }
}
