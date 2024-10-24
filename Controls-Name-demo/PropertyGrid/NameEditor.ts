import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import * as template from 'wml!Controls-Name-demo/PropertyGrid/NameEditor';

export default class NameEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'fullName',
            caption: 'Full Name',
            editorTemplateName: ' Controls-Name/propertyGrid:Editor',
            editorOptions: {
                fields: ['lastName', 'firstName', 'middleName'],
            },
        },
    ];
    protected _editingObject: object = {
        fullName: {
            lastName: 'Уваров',
            firstName: 'Сергей',
            middleName: 'Васильевич',
        },
    };
}
