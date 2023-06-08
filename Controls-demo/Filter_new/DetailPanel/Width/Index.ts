import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/DetailPanel/Width/Index';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/Filter_new/resources/Editors/Dropdown';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: unknown[] = [];

    protected _beforeMount(): void {
        this._items = [
            {
                value: [1],
                itemTemplate:
                    'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
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
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
