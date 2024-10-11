import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/MarkerVisibility/NotMarkIByExpanderClick/NotMarkIByExpanderClick';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NotMarkIByExpanderClick: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    markItemByExpanderClick: false,
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
