import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ColumnScroll/ColumnScroll';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { getActionsForContacts as getItemActions } from '../../list_new/DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    const data = Flat.getData();
    const country = 'Соединенные Штаты Америки';
    // eslint-disable-next-line
    data[2].country = `${country} ${country} ${country}`;
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();
    protected _columns: IColumn[] = [
        {
            displayProperty: 'key',
            width: '60px',
        },
        {
            displayProperty: 'title',
            width: '200px',
        },
        {
            displayProperty: 'country',
            width: '150px',
        },
        {
            displayProperty: 'rating',
            width: '60px',
        },
        {
            displayProperty: 'hasChild',
            width: '120px',
        },
        {
            displayProperty: 'country',
            width: 'max-content',
        },
        {
            displayProperty: 'rating',
            width: '120px',
        },
    ];
    protected _header: IHeaderCell[] = [
        {
            title: '#',
        },
        {
            title: 'Бренд',
        },
        {
            title: 'Страна производителя',
        },
        {
            title: 'Рейтинг',
        },
        {
            title: 'Есть товары?',
        },
        {
            title: 'Еще раз страна',
        },
        {
            title: 'Еще раз рейтинг',
        },
    ];

    static _styles: string[] = ['Controls-demo/treeGridNew/ColumnScroll/ColumnScroll'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 11],
                },
            },
        };
    }
}
