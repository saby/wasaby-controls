import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/groupProperty/Index';
import { IProperty } from 'Controls/propertyGrid';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: IProperty[] = [
        {
            name: 'number',
            caption: 'Number',
            editorTemplateName: 'Controls/propertyGrid:NumberEditor',
            groupField: 'number',
        },
        {
            caption: 'String',
            name: 'siteUrl',
            editorTemplateName: 'Controls/propertyGrid:StringEditor',
            groupField: 'string',
        },
        {
            name: 'decoration',
            caption: 'BooleanGroup',
            editorTemplateName: 'Controls/propertyGrid:BooleanGroupEditor',
            editorOptions: {
                buttons: [
                    {
                        id: 0,
                        tooltip: 'Полужирный',
                        icon: 'icon-Bold',
                    },
                    {
                        id: 1,
                        tooltip: 'Курсив',
                        icon: 'icon-Italic',
                    },
                    {
                        id: 2,
                        tooltip: 'Подчеркнутый',
                        icon: 'icon-Underline',
                    },
                    {
                        id: 3,
                        tooltip: 'Зачёркнутый',
                        icon: 'icon-Stroked',
                    },
                ],
            },
            groupField: 'booleanGroup',
        },
    ];
    protected _editingObject: object = {
        number: 55,
        string: 'text',
        decoration: [true, true, false, true],
    };

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
