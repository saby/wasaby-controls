import { Control, TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import * as Template from 'wml!Controls-demo/filterPanel/Editors/List/Index';
import { Memory } from 'Types/source';

const filterItems = [
    { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
    { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
    { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
    { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
    { id: 5, title: 'Зафиевский Д.А.', owner: 'Зафиевский Д.А.' },
    { id: 6, title: 'Голованов К.А.', owner: 'Голованов К.А.' },
];

export const listConfig = {
    name: 'owners',
    resetValue: [],
    value: [],
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    editorOptions: {
        style: 'master',
        keyProperty: 'id',
        displayProperty: 'title',
        source: new Memory({
            data: filterItems,
            keyProperty: 'id',
        }),
        navigation: {
            source: 'page',
            view: 'cut',
            sourceConfig: {
                pageSize: 3,
                hasMore: false,
                page: 0,
            },
        },
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: filterItems,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                return (
                    queryFilter.owners.includes(item.get('id')) ||
                    !queryFilter.owners.length
                );
            },
        });
        this._filterButtonData = [listConfig];
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/filterPanel/Index',
    ];
}
