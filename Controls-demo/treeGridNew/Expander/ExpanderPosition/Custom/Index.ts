import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderPosition/Custom/Custom';
import * as CntTpl from 'wml!Controls-demo/treeGridNew/Expander/ExpanderPosition/Custom/content';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    protected _expandedItems: CrudEntityKey[] = [null];
    protected _collapsedItems: CrudEntityKey[] = [12];

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                template: CntTpl,
                width: '',
            },
            {
                displayProperty: 'rating',
                width: '',
            },
            {
                displayProperty: 'country',
                width: '',
            },
        ];
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    expandedItems: [null],
                    collapsedItems: [12],
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
