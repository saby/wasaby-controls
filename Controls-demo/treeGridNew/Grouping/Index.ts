import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Grouping/Grouping';
import { createGroupingSource } from 'Controls-demo/treeGridNew/Grouping/Source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '',
            },
            {
                displayProperty: 'count',
                width: '',
            },
        ];
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Grouping: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: createGroupingSource({
                        count: 1000,
                    }),
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            limit: 20,
                            field: 'key',
                            position: 'key_0',
                            direction: 'forward',
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    hasChildrenProperty: 'hasChildren',
                    expanderVisibility: 'hasChildren',
                },
            },
        };
    }
}
