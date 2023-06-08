import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/ExtendedTemplate';
import { IExtendedTemplateOptions, IExtendedPropertyValue } from 'Controls/filterPanel';
import { IFilterItem } from 'Controls/filter';
import { Model } from 'Types/entity';

const DATE_EDITOR = 'dateEditor';
const ACTIVITY_EDITOR = 'activity';

export default class extends Control<IExtendedTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _dateItem: IFilterItem;
    protected _listItem: IFilterItem;

    protected _beforeMount(options: IExtendedTemplateOptions): void {
        this._setItems(options.typeDescription);
    }

    protected _beforeUpdate(options: IExtendedTemplateOptions): void {
        if (options.typeDescription !== this._options.typeDescription) {
            this._setItems(options.typeDescription);
        }
    }

    protected _dateHandler(): void {
        this._notifyChanges(DATE_EDITOR, {
            value: this._dateItem.editorOptions.date,
            textValue: this._dateItem.editorOptions.extendedCaption as string,
            viewMode: 'basic',
        });
    }
    protected _activityHandler(event: Event, item: Model): void {
        this._notifyChanges(ACTIVITY_EDITOR, {
            value: item.getKey(),
            textValue: item.get('title'),
            viewMode: 'basic',
        });
    }

    private _notifyChanges(filterName: string, filterValue: IExtendedPropertyValue): void {
        const newEditingObject = { ...this._options.editingObject };
        newEditingObject[filterName] = filterValue;
        this._notify('editingObjectChanged', [newEditingObject]);
    }

    private _setItems(typeDescription: IFilterItem[]): void {
        this._dateItem = null;
        this._listItem = null;
        typeDescription.forEach((item) => {
            if (item.viewMode === 'extended') {
                if (item.name === DATE_EDITOR) {
                    this._dateItem = item;
                }
                if (item.name === ACTIVITY_EDITOR) {
                    this._listItem = item;
                }
            }
        });
    }
}
