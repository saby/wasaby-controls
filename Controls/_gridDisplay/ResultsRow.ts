/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { Model as EntityModel } from 'Types/entity';
import Row, { IOptions as IBaseRowOptions } from './Row';
import { IColumn, TColumns } from './interface/IColumn';
import Grid, { TColspanCallback, TResultsColspanCallback } from './mixins/Grid';
import ResultsCell from './ResultsCell';
import type { TResultsPosition } from './interface/IGridControl';
import type { IResultConfig } from 'Controls/_grid/dirtyRender/cell/interface';

interface IResultsRowOptions extends IBaseRowOptions<null> {
    metaResults: EntityModel;
    resultsPosition?: TResultsPosition;

    // TODO: Здась другой тип, нужно внутри библиотеки переписать тип, добавить какой то абстрактный
    // колбек или поиграться с типом входных параметров.
    colspanCallback: TResultsColspanCallback;
}

/**
 * Строка результатов в таблице
 * @private
 */
class ResultsRow extends Row<null> {
    protected _$metaResults: EntityModel;
    protected _$resultsPosition: TResultsPosition;
    protected _$resultsVerticalPadding: boolean;

    readonly listElementName: string = 'results';

    constructor(options?: IResultsRowOptions) {
        super({
            ...options,
            colspanCallback: ResultsRow._convertColspanCallback(options.colspanCallback),
        });
    }

    getGridColumnsConfig(): IResultConfig[] {
        const resultsConfig = (this.getOwner() as unknown as Grid)?.getResultsConfig?.();
        if (resultsConfig) {
            return resultsConfig;
        }
        return (this.getOwner() as unknown as Grid).getGridColumnsConfig();
    }

    setGridColumnsConfig(columns: TColumns): void {
        this.setColumnsConfig(columns);
    }

    // region Overrides
    getContents(): string {
        return 'results';
    }

    isSticked(): boolean {
        return this.isStickyHeader() && this.isStickyResults();
    }

    // endregion

    // region Аспект "Стилевое оформление"
    getItemClasses(): string {
        return 'controls-Grid__results tw-contents';
    }

    // endregion

    // region Аспект "Результаты из метаданных"
    getMetaResults(): EntityModel {
        return this._$metaResults;
    }

    setMetaResults(metaResults: EntityModel): void {
        this._$metaResults = metaResults;
        this._$columnItems?.forEach((c) => {
            if (c instanceof ResultsCell) {
                c.setMetaResults(metaResults);
            }
        });
        this._nextVersion();
    }

    // endregion

    // region Аспект "Колонки. Создание, колспан."
    protected _initializeColumns(): void {
        super._initializeColumns({
            colspanStrategy: 'skipColumns',
            prepareStickyLadderCellsStrategy: !this._$rowTemplate ? 'add' : 'colspan',
            addEmptyCellsForStickyLadder: true,
            extensionCellsConstructors: {
                stickyLadderCell: ResultsCell,
                multiSelectCell: this.getColumnsFactory({ column: {} }),
            },
        });
    }

    setColspanCallback(colspanCallback: TResultsColspanCallback): void {
        super.setColspanCallback(ResultsRow._convertColspanCallback(colspanCallback));
    }

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<IResultsRowOptions> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            metaResults: this.getMetaResults(),
            resultsPosition: this._$resultsPosition,
            resultsVerticalPadding: this._$resultsVerticalPadding,
        };
    }

    private static _convertColspanCallback(
        colspanCallback: TResultsColspanCallback
    ): TColspanCallback {
        return colspanCallback
            ? (item, column, columnIndex, isEditing) => {
                  return colspanCallback(column, columnIndex);
              }
            : undefined;
    }

    // endregion
}

Object.assign(ResultsRow.prototype, {
    '[Controls/_display/grid/ResultsRow]': true,
    _moduleName: 'Controls/grid:GridResults',
    _cellModule: 'Controls/grid:GridResultsCell',
    _$metaResults: null,
    _$resultsPosition: 'top',
    _$resultsVerticalPadding: false,
});

export default ResultsRow;
export { ResultsRow, IResultsRowOptions as IOptions, TResultsPosition };
