import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/ListEditor/TitleTemplate/Index';
import * as titleTemplate from 'wml!Controls-demo/filterPanel/resources/TitleTemplate';
import { Memory } from 'Types/source';
import { departments } from 'Controls-demo/Filter_new/resources/DataStorage';
import { isEqual } from 'Types/object';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;
    protected _filterItems: object[] = null;

    protected _beforeMount(): void {
        this._filterItems = [
            { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
            { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
            { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
            { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
            { id: 5, title: 'Всего', owner: 'Всего' },
        ];

        this._source = new Memory({
            data: departments,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                const emptyField = [];
                let addToData = true;
                for (const filterField in queryFilter) {
                    if (queryFilter.hasOwnProperty(filterField) && addToData) {
                        const filterValue = queryFilter[filterField];
                        if (!filterValue) {
                            return;
                        }
                        const itemValue = item.get('owner');
                        addToData =
                            filterValue.includes(itemValue) ||
                            isEqual(filterValue, emptyField) ||
                            filterValue[0] === null ||
                            filterValue[1] === null;
                    }
                }
                return addToData;
            },
        });
        this._filterButtonData = [
            {
                caption: 'Ответственные',
                name: 'owners',
                resetValue: null,
                value: null,
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    titleTemplate,
                    keyProperty: 'owner',
                    displayProperty: 'title',
                    source: new Memory({
                        data: this._filterItems,
                        keyProperty: 'owner',
                    }),
                },
            },
        ];
    }

    static _styles: string[] = [
        'Controls-demo/Filter_new/Filter',
        'Controls-demo/filterPanel/ListEditor/TitleTemplate/index',
    ];
}
