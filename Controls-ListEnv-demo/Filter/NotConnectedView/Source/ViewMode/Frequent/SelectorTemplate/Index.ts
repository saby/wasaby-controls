import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/Source/ViewMode/Frequent/SelectorTemplate/Index';
import 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Dropdown';
import { Memory } from 'Types/source';

type TItem = Record<string, unknown>;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];
    protected _itemsMultiSelect: TItem[];
    protected _navigation: Record<string, unknown>;

    protected _beforeMount(): void {
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: { pageSize: 4, page: 0, hasMore: false },
        };
        this._itemsMultiSelect = [
            { id: '1', title: 'Yaroslavl' },
            { id: '2', title: 'Moscow' },
            { id: '3', title: 'St-Petersburg' },
            { id: '4', title: 'Astrahan' },
            { id: '5', title: 'Arhangelsk' },
            { id: '6', title: 'Abakan' },
            { id: '7', title: 'Barnaul' },
            { id: '8', title: 'Belgorod' },
            { id: '9', title: 'Voronezh' },
            { id: '10', title: 'Vladimir' },
            { id: '11', title: 'Bryansk' },
            { id: '12', title: 'Ekaterinburg' },
            { id: '13', title: 'Kostroma' },
            { id: '14', title: 'Vologda' },
            { id: '15', title: 'Pskov' },
            { id: '16', title: 'Kirov' },
        ];
        this._source = [
            {
                name: 'region',
                value: [null],
                resetValue: [null],
                template:
                    'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Dropdown',
                emptyText: 'all records',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: this._itemsMultiSelect,
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    navigation: this._navigation,
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/stackTemplate/StackTemplate',
                        templateOptions: {
                            items: this._itemsMultiSelect,
                            multiSelect: true,
                        },
                        popupOptions: { width: 300 },
                    },
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
        ];
    }
}
