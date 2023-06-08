/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as DateTemplate from 'wml!Controls/_filterPanel/Editors/Date';
import { StringValueConverter } from 'Controls/date';
import 'css!Controls/filterPanel';
import { Range } from 'Controls/dateUtils';
import IEditorOptions from 'Controls/_filterPanel/_interface/IEditorOptions';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IDateOptions extends IEditorOptions<Date> {
    mask?: string;
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanel/Editors/Date
 * @extends UI/Base:Control
 * @mixes Controls/date:Input
 * @demo Controls-demo/filterPanelPopup/Editors/Date/Index
 * @public
 */

class DateEditor extends Control<IDateOptions> {
    protected _template: TemplateFunction = DateTemplate;
    protected _stringValueConverter: StringValueConverter = null;

    protected _valueChangedHandler(
        event: SyntheticEvent,
        newValue: Date
    ): void {
        this._propertyValueChanged(newValue);
    }

    protected _extendedCaptionClickHandler(): void {
        this._propertyValueChanged(null);
    }

    protected _propertyValueChanged(newValue: Date): void {
        const extendedValue = {
            value: newValue,
            textValue: this._getTextValue(newValue),
            viewMode: 'basic',
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    protected _getTextValue(value: Date): string {
        if (!this._stringValueConverter) {
            const stringValueConverterClass =
                loadSync('Controls/date').StringValueConverter;
            this._stringValueConverter = new stringValueConverterClass();
        }
        return this._stringValueConverter.getStringByValue(
            value,
            this._options.mask
        );
    }

    static getDefaultOptions(): object {
        return {
            mask: Range.dateMaskConstants.DD_MM_YY,
        };
    }
}
export default DateEditor;
