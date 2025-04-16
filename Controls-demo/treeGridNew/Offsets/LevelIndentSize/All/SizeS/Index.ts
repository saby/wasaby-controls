import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeS/SizeS';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../../../../DemoHelpers/ExpandedSource';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            OffsetsLevelIndentSizeAllSizeS: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 11, 12, 13, 14, 15, 16, 153],
                },
            },
        };
    }
}
