import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/Chips/MultiSelect/Demo';
import { RecordSet } from 'Types/collection';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'selected',
            caption: 'ChipsEditor',
            editorTemplateName: 'Controls/propertyGridEditors:Chips',
            editorOptions: {
                multiSelect: true,
                items: new RecordSet({
                    rawData: [
                        {
                            id: '1',
                            caption: 'Название 1',
                        },
                        {
                            id: '2',
                            caption: 'Название 2',
                        },
                        {
                            id: '3',
                            caption: 'Название 3',
                        },
                        {
                            id: '4',
                            caption: '4',
                        },
                        {
                            id: '5',
                            caption: 'Название 5',
                        },
                    ],
                    keyProperty: 'id',
                }),
            },
        },
    ];
    protected _editingObject: object = {
        selected: ['1'],
    };
}
