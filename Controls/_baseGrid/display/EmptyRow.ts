/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IColumn } from './interface/IColumn';
import Row, { IOptions as IBaseRowOptions } from './Row';
import { IItemTemplateParams } from './mixins/Row';
import { TColspanCallbackResult } from './mixins/Grid';

/**
 * Строка пустого представления таблицы
 * @private
 */
class EmptyRow extends Row<null> {
    readonly listElementName: string = 'empty';

    private _containerSize: number;

    getContents(): string {
        return 'emptyRow';
    }

    getHasEmptyView() {
        return this.getOwner().getHasEmptyView();
    }

    getItemClasses(params: IItemTemplateParams): string {
        return (
            'js-controls-GridView__emptyTemplate' +
            ' controls-GridView__emptyTemplate' +
            ` ${this._getBaseItemClasses(params)}`
        );
    }

    setContainerSize(size: number): void {
        if (this._containerSize !== size) {
            this._containerSize = size;
            this._nextVersion();
        }
    }

    getContainerSize(): number {
        return this._containerSize;
    }

    // region Аспект "Колонки. Создание, колспан."
    protected _initializeColumns(): void {
        super._initializeColumns({
            colspanStrategy: 'manual',
            prepareStickyLadderCellsStrategy: !this._$rowTemplate ? 'add' : 'colspan',
            shouldAddMultiSelectCell: !this._$rowTemplate,
            shouldAddSpacingCell: !this._$rowTemplate,
            extensionCellsConstructors: {
                multiSelectCell: this.getColumnsFactory({
                    column: {
                        startColumn: 1,
                        endColumn: 2,
                    },
                    colspan: 1,
                }),
            },
        });
    }

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        return column.endColumn - column.startColumn;
    }

    // endregion
}

Object.assign(EmptyRow.prototype, {
    '[Controls/_display/grid/EmptyRow]': true,
    _moduleName: 'Controls/grid:GridEmptyRow',
    _cellModule: 'Controls/grid:GridEmptyCell',
    _instancePrefix: 'grid-empty-row-',
});

export default EmptyRow;
export { EmptyRow, IBaseRowOptions as IOptions };
