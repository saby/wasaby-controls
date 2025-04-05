import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/HorizontalLeaves/HorizontalLeaves';
import * as ItemTemplate from 'wml!Controls-demo/tree/HorizontalLeaves/ItemTemplate';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import data from 'Controls-demo/tree/data/Halls';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemTemplate: TemplateFunction = ItemTemplate;
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
        },
    ];

    static _styles: string[] = ['Controls-demo/tree/HorizontalLeaves/styles'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HorizontalLeaves: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 2],
                    markerVisibility: 'hidden',
                },
            },
        };
    }
}
