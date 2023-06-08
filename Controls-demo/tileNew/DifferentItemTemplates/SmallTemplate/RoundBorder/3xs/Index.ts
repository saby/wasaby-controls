import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/SmallTemplate/RoundBorder/3xs/3xs';

import { Gadgets } from '../../../../DataHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: string[] = [];
    protected _roundBorder: object = {
        tl: '3xs',
        tr: '3xs',
        br: '3xs',
        bl: '3xs',
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
