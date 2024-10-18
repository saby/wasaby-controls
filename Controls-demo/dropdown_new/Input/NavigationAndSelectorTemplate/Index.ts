import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/NavigationAndSelectorTemplate/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _items: object[];
    protected _navigation: object;
    protected _selectedKeys: string[] = ['1'];
    protected _selectedItems: RecordSet;

    protected _beforeMount(): void {
        this._navigation = {
            view: 'page',
            source: 'page',
            sourceConfig: {
                pageSize: 4,
                page: 0,
                hasMore: false,
            },
        };

        this._items = [
            {
                key: '1',
                title: 'Наша компания',
            },
            {
                key: '2',
                title: 'Все юридические лица',
            },
            {
                key: '3',
                title: 'Инори, ООО',
            },
            {
                key: '"4',
                title: '"Компания "Тензор" ООО',
            },
            {
                key: '5',
                title: 'Ромашка, ООО',
            },
            {
                key: '6',
                title: 'Сбербанк-Финанс, ООО',
            },
            {
                key: '7',
                title: 'Петросоюз-Континент, ООО',
            },
            {
                key: '8',
                title: 'Альфа Директ сервис, ОАО',
            },
            {
                key: '9',
                title: 'АК "ТРАНСНЕФТЬ", ОАО',
            },
            {
                key: '10',
                title: 'Иванова Зинаида Михайловна, ИП',
            },
        ];

        this._selectedItems = new RecordSet({
            rawData: [this._items.slice(0, 1)],
            keyProperty: 'key',
        });

        this._source = new Memory({
            data: this._items,
            keyProperty: 'key',
        });
    }
}
