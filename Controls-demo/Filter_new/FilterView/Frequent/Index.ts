import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/Frequent/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = null;
    protected _source: Memory = null;
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'response',
                value: null,
                resetValue: null,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                            { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                            { id: 'Субботин А.В.', title: 'Субботин А.В.' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];

        this._viewSource = new Memory({
            data: [
                { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                { id: 'Субботин А.В.', title: 'Субботин А.В.' },
            ],
            keyProperty: 'department',
            filter: (item, queryFilter) => {
                return (
                    queryFilter.response?.includes(item.get('id')) ||
                    !queryFilter.response?.length
                );
            },
        });
    }
    static _styles: string[] = ['DemoStand/Controls-demo'];
}
