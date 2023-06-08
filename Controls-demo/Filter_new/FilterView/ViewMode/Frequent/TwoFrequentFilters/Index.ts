import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/ViewMode/Frequent/TwoFrequentFilters/Index';
import 'Controls-demo/Filter_new/resources/HistorySourceDemo';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = [];
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'response',
                value: [],
                resetValue: [],
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
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
            {
                name: 'department',
                value: 'Разработка',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 'Разработка', title: 'Разработка' },
                            { id: 'Тестирование', title: 'Тестирование' },
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
                {
                    id: 'Новиков Д.В.',
                    title: 'Новиков Д.В.',
                    department: 'Разработка',
                },
                {
                    id: 'Кошелев А.Е.',
                    title: 'Кошелев А.Е.',
                    department: 'Разработка',
                },
                {
                    id: 'Субботин А.В.',
                    title: 'Субботин А.В.',
                    department: 'Тестирование',
                },
            ],
            keyProperty: 'department',
            filter: (item, queryFilter) => {
                return (
                    (queryFilter.response?.includes(item.get('id')) ||
                        !queryFilter.response?.length) &&
                    (queryFilter.department?.includes(item.get('department')) ||
                        !queryFilter.department?.length)
                );
            },
        });
    }
    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
    ];
}
