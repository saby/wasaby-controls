import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Control, TemplateFunction } from 'UI/Base';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import * as template from 'wml!Controls-demo/treeGridNew/ItemsSpacing/Base/Index';
import 'css!DemoStand/Controls-demo';
import { TOffsetSize } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class Index extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    protected _itemsSpacing: TOffsetSize = 'm';

    protected _itemsSpacingSource: RecordSet = new RecordSet({
        rawData: [
            { id: '3xs' },
            { id: '2xs' },
            { id: 'xs' },
            { id: 's' },
            { id: 'st' },
            { id: 'm' },
            { id: 'l' },
            { id: 'xl' },
            { id: '2xl' },
            { id: '3xl' },
        ],
        keyProperty: 'id',
    });

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemsSpacingBase: {
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
                },
            },
        };
    }
}
