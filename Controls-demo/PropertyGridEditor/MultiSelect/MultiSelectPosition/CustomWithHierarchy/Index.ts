import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/MultiSelect/MultiSelectPosition/CustomWithHierarchy/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];
    protected _selectedKeys = ['level1', 'level2', 'level3', 'level4'];

    protected _beforeMount(): void {
        this._editingObject = {
            level1: 'Описание 1 уровня',
            level2: 'Описание 2 уровня',
            level3: 'Описание 3 уровня',
            level4: 'Описание 4 уровня',
        };

        this._typeDescription = [
            {
                name: 'level1',
                caption: 'Уровень 1',
                parent: null,
            },
            {
                name: 'level2',
                caption: 'Уровень 2',
                parent: 'level1',
            },
            {
                name: 'level3',
                caption: 'Уровень 3',
                parent: 'level2',
            },
            {
                name: 'level4',
                caption: 'Уровень 4',
                '@parent': null,
                parent: 'level3',
                editorOptions: {
                    minLines: 3,
                },
                type: 'text',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
