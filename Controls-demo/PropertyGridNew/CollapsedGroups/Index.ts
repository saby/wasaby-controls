import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/CollapsedGroups/Index';
import { getEditingObject, getSource } from 'Controls-demo/PropertyGridNew/resources/Data';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];
    protected _collapsedGroups: string[];

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = getSource();
        this._collapsedGroups = ['boolean'];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
