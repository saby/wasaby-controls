/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { Indicator as DefaultIndicator, isFullGridSupport } from 'Controls/display';
import { TemplateFunction } from 'UI/Base';
import { TColumns } from './interface/IColumn';

/**
 * Индикатор загрузки данных в таблице (Крутилка)
 * @private
 */
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
        const withMultiSelect = this._$hasMultiSelectColumn && !this.getOwner().hasColumnScroll();
        let classes =
            `controls-Grid__loadingIndicator${withMultiSelect ? '_withMultiselect' : ''}` +
            ` controls-Grid__loadingIndicator-${this._$position}`;
        if (this._$state === 'portioned-search') {
            classes += ` ${this._getPortionedSearchClasses()}`;
        }
        if (this._$position === 'global') {
            classes += ' tw-absolute tw-w-full';
        }

        if (this.getOwner().hasColumnScroll()) {
            const selectors = this.getOwner().getColumnScrollSelectors();
            classes += ` ${selectors.FIXED_ELEMENT} ${selectors.STRETCHED_TO_VIEWPORT_ELEMENT}`;
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
