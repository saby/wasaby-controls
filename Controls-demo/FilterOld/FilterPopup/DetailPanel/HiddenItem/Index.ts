import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterPopup/DetailPanel/HiddenItem/HiddenItem';
import 'wml!Controls-demo/FilterOld/FilterPopup/resources/Editors/Dropdown';
import 'wml!Controls-demo/FilterOld/FilterPopup/DetailPanel/HiddenItem/itemTemplate';
import { Memory } from 'Types/source';
import 'css!Controls-demo/FilterOld/FilterPopup/DetailPanel/Filter';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: unknown[] = [];

    protected _beforeMount(): void {
        this._items = [
            {
                name: 'Category',
                value: [1],
                resetValue: [1],
                textValue: '',
                itemTemplate: 'wml!Controls-demo/FilterOld/FilterPopup/resources/Editors/Dropdown',
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
                name: 'hiddenItem',
                value: '',
                resetValue: '',
                textValue: '',
                viewMode: 'basic',
            },
            {
                name: 'visibleItem',
                visible: true,
                value: '',
                resetValue: '',
                textValue: '',
                viewMode: 'basic',
            },
            {
                name: 'text',
                value: '',
                resetValue: '',
                textValue: '',
                viewMode: 'basic',
            },
        ];
    }
}
