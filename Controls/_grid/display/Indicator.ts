/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import {
    Indicator as DefaultIndicator,
    isFullGridSupport,
} from 'Controls/display';
import { TemplateFunction } from 'UI/Base';
import { TColumns } from 'Controls/_grid/display/interface/IColumn';

export default class Indicator extends DefaultIndicator {
    protected _isFullGridSupport: boolean = isFullGridSupport();

    private _$gridColumnsConfig: TColumns;
    private _$hasMultiSelectColumn: boolean;

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return this._isFullGridSupport
            ? 'Controls/grid:IndicatorComponent'
            : 'Controls/gridIE:IndicatorComponent';
    }

    getGridClasses(): string {
        let classes = 'controls-Grid__loadingIndicator';
        if (this._$state === 'portioned-search') {
            classes += ` ${this._getPortionedSearchClasses()}`;
        }
        if (this._$position === 'global') {
            classes += ' controls-Grid__loadingIndicator-global';
        }
        return classes;
    }

    getColspan(): number {
        return this._$gridColumnsConfig.length + +this._$hasMultiSelectColumn;
    }

    setGridColumnsConfig(columns: TColumns): void {
        this._$gridColumnsConfig = columns;
        this._nextVersion();
    }

    setHasMultiSelectColumn(hasMultiSelectColumn: boolean): void {
        if (this._$hasMultiSelectColumn !== hasMultiSelectColumn) {
            this._$hasMultiSelectColumn = hasMultiSelectColumn;
            this._nextVersion();
        }
    }
}

Object.assign(Indicator.prototype, {
    'Controls/grid:Indicator': true,
    _moduleName: 'Controls/grid:Indicator',
    _$gridColumnsConfig: null,
    _$hasMultiSelectColumn: false,
});
