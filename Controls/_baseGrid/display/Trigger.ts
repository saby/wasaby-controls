/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { isFullGridSupport, Trigger as DefaultTrigger } from 'Controls/display';
import { TColumns } from './interface/IColumn';
import { TemplateFunction } from 'UI/Base';

export default class Trigger extends DefaultTrigger {
    protected _isFullGridSupport: boolean = isFullGridSupport();

    private _$gridColumnsConfig: TColumns;
    private _$hasMultiSelectColumn: boolean;

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return this._isFullGridSupport
            ? super.getTemplate(itemTemplateProperty, userTemplate)
            : 'Controls/gridIE:TriggerTemplate';
    }

    getColspan(): number {
        return this._$gridColumnsConfig.length + +this._$hasMultiSelectColumn;
    }

    setGridColumnsConfig(columns: TColumns): void {
        this._$gridColumnsConfig = columns;
        this._nextVersion();
    }

    setHasMultiSelectColumn(hasMultiSelectColumn: boolean) {
        if (this._$hasMultiSelectColumn !== hasMultiSelectColumn) {
            this._$hasMultiSelectColumn = hasMultiSelectColumn;
            this._nextVersion();
        }
    }
}

Object.assign(Trigger.prototype, {
    'Controls/grid:Trigger': true,
    _moduleName: 'Controls/grid:Trigger',
    _$gridColumnsConfig: null,
    _$hasMultiSelectColumn: false,
});
