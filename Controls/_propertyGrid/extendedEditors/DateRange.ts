/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

import DateRangeTemplate = require('wml!Controls/_propertyGrid/extendedEditors/DateRange');

interface IDateRangeEditorOptions extends IEditorOptions, IControlOptions {
    propertyValue: Date[];
}

/**
 * Редактор для поля выбора периода дат.
 * @extends Controls/dateRange:Input
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/DateRangeEditor/Index
 * @public
 */
class DateRangeEditor
    extends Control<IDateRangeEditorOptions>
    implements IEditor
{
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _startDate: Date;
    protected _endDate: Date;

    protected _beforeMount(options: IDateRangeEditorOptions): void {
        const [startDate, endDate] = this._getPropertyValueByOptions(
            options.propertyValue
        );
        this._startDate = startDate;
        this._endDate = endDate;
    }

    protected _beforeUpdate(newOptions: IDateRangeEditorOptions): void {
        const propertyValue = this._getPropertyValueByOptions(
            newOptions.propertyValue
        );
        if (this._options.propertyValue !== propertyValue) {
            const [startDate, endDate] = propertyValue;
            this._startDate = startDate;
            this._endDate = endDate;
        }
    }

    protected _handleInputCompleted(
        event: SyntheticEvent,
        startDate: Date,
        endDate: Date
    ): void {
        this._notify('propertyValueChanged', [[startDate, endDate]], {
            bubbling: true,
        });
    }

    private _getPropertyValueByOptions(value: Date[] | null): Date[] {
        return value || [null, null];
    }

    static getDefaultOptions(): object {
        return {
            propertyValue: [null, null],
        };
    }
}
export default DateRangeEditor;
