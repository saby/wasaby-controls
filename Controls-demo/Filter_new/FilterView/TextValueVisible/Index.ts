import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/TextValueVisible/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = [
            {
                name: 'Category',
                value: [3],
                resetValue: [1],
                itemTemplate:
                    'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
                textValue: 'Видео',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'Картинки' },
                            { id: 2, title: 'Документы' },
                            { id: 3, title: 'Видео' },
                            { id: 4, title: 'Аудио' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'basic',
            },
            {
                name: 'NDS',
                value: [1],
                resetValue: [],
                textValue: 'С НДС',
                textValueVisible: false,
                viewMode: 'basic',
                itemTemplate:
                    'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
                additionalTemplate:
                    'Controls-demo/Filter_new/resources/Editors/Additional/Select',
                visibility: false,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'С НДС' },
                            { id: 3, title: 'БЕЗ НДС' },
                        ],
                    }),
                },
            },
        ];
    }
    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
    ];
}
