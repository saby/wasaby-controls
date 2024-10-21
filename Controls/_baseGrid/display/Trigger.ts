/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
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
