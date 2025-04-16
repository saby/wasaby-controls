import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Actions/_commands/CreateTask/RuleChooserEditor';

interface IOptions extends IControlOptions {
    docType: string;
    propertyValue?: string;
}

export default class RuleChooserEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[];

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._updateSelectedKeys(propertyValue);
    }

    protected _beforeUpdate({ propertyValue }: IOptions): void {
        if (propertyValue !== this._options.propertyValue) {
            this._updateSelectedKeys(propertyValue);
        }
    }

    protected _selectedKeysChangedHandler(_: Event, [selectedKey]: string[]): void {
        this._notify('propertyValueChanged', [selectedKey], { bubbling: true });
    }

    private _updateSelectedKeys(propertyValue: string): void {
        if (!propertyValue) {
            this._selectedKeys = [];
        } else {
            this._selectedKeys = [propertyValue];
        }
    }
}
