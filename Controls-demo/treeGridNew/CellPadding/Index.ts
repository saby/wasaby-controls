import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/CellPadding/CellPadding';
import { Memory } from 'Types/source';
import { IHeaderCell } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown = [
        {
            displayProperty: 'title',
            cellPadding: {
                right: 'S',
            },
            width: '',
        },
        {
            displayProperty: 'rating',
            cellPadding: {
                left: 'S',
                right: 'null',
            },
            width: '',
        },
        {
            displayProperty: 'country',
            width: '',
        },
    ];
    protected _header: IHeaderCell[] = [
        {
            title: 'cellPadding: right: S',
        },
        {
            title: 'cellPadding:  left: S and right: null',
        },
        {
            title: 'cellPadding left: default',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            CellPadding: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
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
