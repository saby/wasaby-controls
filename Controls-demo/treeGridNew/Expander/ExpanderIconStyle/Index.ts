import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';

import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderIconStyle/ExpanderIconStyle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExpanderIconStyle: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'Раздел',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    expandedItems: [null],
                },
            },
        };
    }
}
