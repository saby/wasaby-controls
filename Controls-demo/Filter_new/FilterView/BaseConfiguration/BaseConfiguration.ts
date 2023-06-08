import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/BaseConfiguration/BaseConfiguration';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'city',
                value: ['Yaroslavl'],
                resetValue: ['Yaroslavl'],
                viewMode: 'basic',
                textValue: '',
                itemTemplate:
                    'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
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
                },
            },
        ];
    }
}
