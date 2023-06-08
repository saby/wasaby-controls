/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import * as template from 'wml!Controls/_propertyGrid/defaultEditors/Date';
import { Base as dateUtils } from 'Controls/dateUtils';

export interface IDateEditorOptions extends IEditorOptions {
    propertyValue: Date;
}
/**
 * Редактор для данных с типом "дата".
 * @extends UI/Base:Control
 * @demo Controls-demo/PropertyGridNew/Editors/DateEditor/Index
 * @public
 */
export default class DateEditor
    extends Control<IDateEditorOptions>
    implements IEditor
{
    protected _template: TemplateFunction = template;
    protected _value: unknown = null;

    protected _beforeMount(options?: IEditorOptions): void {
        this._updateValue(options.propertyValue);
    }

    protected _beforeUpdate(options?: IEditorOptions): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._updateValue(options.propertyValue);
        }
    }

    protected _handleInputCompleted(
        event: SyntheticEvent,
        value: Date | null
    ): void {
        if (value === null || dateUtils.isValidDate(value)) {
            this._notify('propertyValueChanged', [value], { bubbling: true });
        }
    }

    private _updateValue(newValue: unknown): void {
        this._value = newValue;
    }

    static getDefaultOptions(): Partial<IDateEditorOptions> {
        return {
            propertyValue: null,
        };
    }
}
