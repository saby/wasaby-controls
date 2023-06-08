import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/HistoryId/FavoriteDialog/Index';
import { Memory } from 'Types/source';
import 'Controls-demo/filterPanelPopup/HistoryId/FavoriteDialog/HistorySourceDemo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._filterButtonData = [
            {
                name: 'city',
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                resetValue: [],
                value: ['Moscow'],
                viewMode: 'basic',
                textValue: '',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 'Yaroslavl', title: 'Yaroslavl' },
                            { id: 'Moscow', title: 'Moscow' },
                            { id: 'Kazan', title: 'Kazan' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    multiSelect: true,
                },
            },
        ];

        this._source = new Memory({
            data: [
                { id: 'Yaroslavl', title: 'Yaroslavl' },
                { id: 'Moscow', title: 'Moscow' },
                { id: 'Kazan', title: 'Kazan' },
            ],
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                return (
                    queryFilter.city.includes(item.get('id')) ||
                    !queryFilter.city.length
                );
            },
        });
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
