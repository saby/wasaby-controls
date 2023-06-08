import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/InputMask/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'mask',
            caption: 'InputMask',
            editorTemplateName: 'Controls/propertyGrid:InputMaskEditor',
            editorOptions: {
                mask: '+7(ddd)ddd-dd-dd',
            },
        },
    ];
    protected _editingObject: object = {
        mask: '9999999999',
    };
}
