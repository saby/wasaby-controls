/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel } from 'Types/entity';
import ResultsRow from './ResultsRow';
import type { TResultsPosition } from './interface/IGridControl';
import Cell, { IOptions as IBaseCellOptions } from './Cell';

interface IResultsCellOptions extends IBaseCellOptions<null> {
    metaResults?: EntityModel;
    resultsPosition?: TResultsPosition;
}

const FIXED_RESULTS_Z_INDEX = 4;
const STICKY_RESULTS_Z_INDEX = 3;
// Когда результаты находятся внизу, они должны перекрываться операциями над записью.
const FIXED_RESULTS_POSITION_BOTTOM_Z_INDEX = 2;
const STICKY_RESULTS_POSITION_BOTTOM_Z_INDEX = 1;

export const GRID_RESULTS_CELL_DEFAULT_TEMPLATE: string = 'Controls/grid:ResultColumnTemplate';

/**
 * Ячейка строки результатов в таблице
 * @private
 */
class ResultsCell extends Cell<null, ResultsRow> {
    protected readonly _defaultCellTemplate: string = GRID_RESULTS_CELL_DEFAULT_TEMPLATE;
    protected _$metaResults: EntityModel;
    private _$resultsPosition: string;
    private _$resultsVerticalPadding: boolean;
    private _$isCheckBoxCell: boolean;
    protected _data: string | number;
    protected _format: string;
    protected '[Controls/_display/grid/ResultsCell]': boolean;

    readonly listInstanceName: string = 'controls-Grid__results';

    constructor(options?: IResultsCellOptions) {
        super(options);
        this._prepareDataAndFormat();
    }

    // TODO: Рассмотреть возможность перевода на отдельную опцию.
    //  Перегрузка необходима из за того, что конфигурация результатов объединена с колонками.
    //  Если результаты будут иметь отдельную опцию под конфиг, то будет полная однородность, метод будет не нужен.
    getTemplate(): TemplateFunction | string {
        const customTemplate = this._$isSingleColspanedCell
            ? this._$column.resultTemplate || this._$column.template
            : this._$column?.resultTemplate;
        return customTemplate || this._defaultCellTemplate;
    }

    getTemplateOptions(): { [key: string]: unknown } {
        return (
            this._$column &&
            this._$column[
                this._$isSingleColspanedCell ? 'templateOptions' : 'resultTemplateOptions'
            ]
        );
    }

    // region Аспект "Данные и формат"
    get data(): string | number {
        return this._data;
    }

    get format(): string {
        return this._format;
    }

    get CheckBoxCell(): boolean {
        return (
            !this._$isLadderCell &&
            this._$isCheckBoxCell &&
            this._$owner.hasMultiSelectColumn()
        );
    }

    get resultsVerticalPadding(): boolean {
        return this._$resultsVerticalPadding;
    }

    setMetaResults(metaResults: EntityModel): void {
        this._$metaResults = metaResults;
        this._prepareDataAndFormat();
        this._nextVersion();
    }

    getMetaResults(): EntityModel {
        return this._$metaResults;
    }

    protected _prepareDataAndFormat(): void {
        const results = this.getMetaResults();
        const displayProperty = this._$column && this._$column.displayProperty;
        if (results && displayProperty) {
            const metaResultsFormat = results.getFormat();
            const displayPropertyFormatIndex = metaResultsFormat.getIndexByValue(
                'name',
                displayProperty
            );
            this._data = results.get(displayProperty);
            if (displayPropertyFormatIndex !== -1) {
                this._format = metaResultsFormat.at(displayPropertyFormatIndex).getType() as string;
            }
        }
    }

    // endregion

    isLadderCell(): boolean {
        return this._$isLadderCell;
    }

    getZIndex(): number {
        // Стереть код
        let zIndex;
        if (this._$owner.hasColumnScroll()) {
            const sticky =
                this._$resultsPosition === 'bottom'
                    ? STICKY_RESULTS_POSITION_BOTTOM_Z_INDEX
                    : STICKY_RESULTS_Z_INDEX;
            const fixed =
                this._$resultsPosition === 'bottom'
                    ? FIXED_RESULTS_POSITION_BOTTOM_Z_INDEX
                    : FIXED_RESULTS_Z_INDEX;
            zIndex = this._$isFixed ? fixed : sticky;
        } else {
            zIndex =
                this._$resultsPosition === 'bottom'
                    ? STICKY_RESULTS_POSITION_BOTTOM_Z_INDEX
                    : FIXED_RESULTS_Z_INDEX;
        }
        return zIndex;
    }

    getTextOverflowClasses(): string {
        return this._$column?.textOverflow ? 'ws-ellipsis' : null;
    }

    // endregion

    getVerticalStickyHeaderPosition(): string {
        return this._$resultsPosition;
    }

    getStickyHeaderMode(): string {
        return 'stackable';
    }
}

Object.assign(ResultsCell.prototype, {
    '[Controls/_display/grid/ResultsCell]': true,
    _moduleName: 'Controls/grid:GridResultsCell',
    _instancePrefix: 'grid-results-cell-',
    _$metaResults: null,
    _$resultsPosition: 'top',
    _$resultsVerticalPadding: false,
    _$isCheckBoxCell: false,
});

export default ResultsCell;
export { ResultsCell, IResultsCellOptions as IOptions };
