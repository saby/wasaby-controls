import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { getEditingObject, getSource } from 'Controls-demo/PropertyGridNew/resources/Data';

import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/AfterEditorTemplate/Render/Render';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = getSource();
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
