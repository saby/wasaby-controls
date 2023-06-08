/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IEditorOptions } from 'Controls/filterPanel';
import DateRangeTemplate = require('wml!Controls/_filterPanelExtEditors/NumberRange/NumberRange');
import 'css!Controls/filterPanelExtEditors';

interface INumberRangeOptions extends IEditorOptions<number[]> {
    afterEditorTemplate: TemplateFunction;
    minValueInputPlaceholder: string;
    maxValueInputPlaceholder: string;
}

interface INumberRange {
    readonly '[Controls/_filterPanelExtEditors/NumberRange]': boolean;
}

/**
 * Контрол используют в качестве редактора для выбора диапазона чисел на {@link Controls/filterPanel:View панели фильтров}.
 * @class Controls/_filterPanelExtEditors/NumberRange
 * @extends UI/Base:Control
 * @mixes Controls/input:Number
 * @demo Controls-ListEnv-demo/Filter/View/Editors/NumberRangeEditor/Index
 * @public
 */

class NumberRangeEditor extends Control<INumberRangeOptions> implements INumberRange {
    readonly '[Controls/_filterPanelExtEditors/NumberRange]': boolean = true;
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _minValue: number | null = null;
    protected _maxValue: number | null = null;

    protected _beforeMount(options?: INumberRangeOptions): void {
        this._updateValues(options.propertyValue);
    }

    protected _beforeUpdate(options?: INumberRangeOptions): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._updateValues(options.propertyValue);
        }
    }

    protected _handleMinValueChanged(event: SyntheticEvent, value: number): void {
        if (value <= this._maxValue || !this._maxValue) {
            this._minValue = value;
            this._processPropertyValueChanged(event, [this._minValue, this._maxValue]);
        }
    }

    protected _handleMaxValueChanged(event: SyntheticEvent, value: number): void {
        this._maxValue = value;
        this._processPropertyValueChanged(event, [this._minValue, this._maxValue]);
    }

    protected _handleInputCompleted(event: SyntheticEvent, value: number): void {
        if (this._needReplaceMinMaxValues()) {
            this._replaceMinMaxValues(this._minValue, this._maxValue);
        }
        this._processPropertyValueChanged(event, [this._minValue, this._maxValue]);
    }

    protected _getExtendedValue(): object {
        const value = [this._minValue, this._maxValue];
        return {
            value,
            textValue: !this._isValueEmpty(value) ? this._getTextValue(value) : '',
        };
    }

    protected _extendedCaptionClickHandler(event: SyntheticEvent): void {
        this._processPropertyValueChanged(event, this._options.propertyValue);
    }

    private _updateValues(newValue: number[]): void {
        this._minValue = newValue[0] !== undefined ? newValue[0] : null;
        this._maxValue = newValue[1] !== undefined ? newValue[1] : null;
    }

    private _processPropertyValueChanged(event: SyntheticEvent, value: number[]): void {
        if (this._needNotifyChanges(value)) {
            this._notify('propertyValueChanged', [this._getExtendedValue()], {
                bubbling: true,
            });
        }
    }

    private _needReplaceMinMaxValues(): boolean {
        return (
            this._minValue !== null && this._maxValue !== null && this._minValue > this._maxValue
        );
    }

    private _replaceMinMaxValues(minValue: number, maxValue: number): void {
        this._minValue = maxValue;
        this._maxValue = minValue;
    }

    private _needNotifyChanges(values: number[]): boolean {
        const minValue = values[0];
        const maxValue = values[1];
        return minValue <= maxValue || !minValue || !maxValue;
    }

    private _isValueEmpty(value: number[]): boolean {
        return value[0] === null && value[1] === null;
    }

    private _getTextValue(value: number[]): string | number {
        let resultString = '';
        if (value[0] !== null) {
            resultString += 'от ' + value[0];
        }
        if (value[1] !== null) {
            resultString += (resultString.length ? ' ' : '') + 'до ' + value[1];
        }
        return resultString;
    }

    static getDefaultOptions(): object {
        return {
            contrastBackground: false,
            borderVisibility: 'partial',
            horizontalPadding: 'null',
        };
    }
}
export default NumberRangeEditor;

/**
 * @name Controls/_filterPanelExtEditors/NumberRange#minValueInputPlaceholder
 * @cfg {String} Устанавливает placeholder для поля ввода минимального значения.
 */

/**
 * @name Controls/_filterPanelExtEditors/NumberRange#maxValueInputPlaceholder
 * @cfg {String} Устанавливает placeholder для поля ввода максимального значения.
 */

/**
 * @name Controls/_filterPanelExtEditors/NumberRange#afterEditorTemplate
 * @cfg {String} Шаблон, который отобразится справа от редактора.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/NumberRangeEditor/Index
 * @example
 * Создаем шаблон, который передадим в afterEditorTemplate:
 * MyAfterEditorTemplate.wml:
 * <pre class="brush: html">
 *    <span class="myClass"> руб. </span>
 * </pre>
 * JS:
 * <pre class="brush: js">
 *    this._sourse = [{
 *      group: 'Стоимость товара',
 *      name: 'amount',
 *      editorTemplateName: 'Controls/filterPanelExtEditors:NumberRangeEditor',
 *      value: [],
 *      editorOptions: {
 *          afterEditorTemplate: 'wml!MyAfterEditorTemplate'
 *      }
 *    }];
 * </pre>
 */

/**
 * @name Controls/_filterPanelExtEditors/NumberRange#value
 * @cfg {Array<Date>} Массив из двух значений - число "от" и число "до".
 * @see resetValue
 */

/**
 * @name Controls/_filterPanelExtEditors/NumberRange#resetValue
 * @cfg {Array<Date>} Массив из двух значений - число "от" и число "до", которые применятся при сбросе.
 * @see value
 */
