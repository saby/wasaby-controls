import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/PhoneEditor/PhoneEditor';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'phone',
            caption: 'Phone',
            editorTemplateName: 'Controls/propertyGridEditors:Phone',
        },
    ];
    protected _editingObject: object = {
        phone: '9999999999',
    };
}
