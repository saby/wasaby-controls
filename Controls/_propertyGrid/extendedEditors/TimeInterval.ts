/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import TimeIntervalTemplate = require('wml!Controls/_propertyGrid/extendedEditors/TimeInterval');
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import { StringValueConverter } from 'Controls/date';
import { Time } from 'Types/entity';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface ITimeIntervalEditorOptions extends IEditorOptions, IControlOptions {
    mask: string;
}
/**
 * Редактор для временного интервала.
 * @extends Controls/date:BaseInput
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/TimeInterval/Index
 * @public
 */
class TimeIntervalEditor
    extends Control<ITimeIntervalEditorOptions>
    implements IEditor
{
    protected _template: TemplateFunction = TimeIntervalTemplate;
    protected _value: unknown = null;
    private _stringValueConverter: typeof StringValueConverter = null;

    protected _beforeMount(options: ITimeIntervalEditorOptions): void {
        this._updateValues(options.propertyValue, options.mask);
    }

    protected _beforeUpdate(options: ITimeIntervalEditorOptions): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._updateValues(options.propertyValue, options.mask);
        }
    }

    protected _handleInputCompleted(event: SyntheticEvent, value: Date): void {
        this._notify(
            'propertyValueChanged',
            [
                this._getStringValueConverter(
                    this._options.mask
                ).getStringByValue(value),
            ],
            { bubbling: true }
        );
    }

    private _updateValues(newValue: unknown, mask: string): void {
        this._value =
            typeof newValue === 'string'
                ? this._getStringValueConverter(mask).getValueByString(newValue)
                : newValue;
    }

    private _getStringValueConverter(mask: string): StringValueConverter {
        // StringValueConverter требуется, т.к. система типов не умеет определять и сериализовывать
        // значения типа TimeInterval, хотя такой тип там выделен
        // будет правиться по ошибке в 21.2100
        // https://online.sbis.ru/opendoc.html?guid=d7d07873-f7fc-4cb6-9e44-e681473530e5
        if (!this._stringValueConverter) {
            const stringValueConverterClass =
                loadSync('Controls/date').StringValueConverter;
            this._stringValueConverter = new stringValueConverterClass({
                replacer: ' ',
                mask,
                dateConstructor: Time,
            });
        }
        return this._stringValueConverter;
    }
}
export default TimeIntervalEditor;
