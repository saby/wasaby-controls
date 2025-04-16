import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { TScrollMode } from 'Controls/scroll';

import * as Template from 'wml!Controls-demo/tileNew/Horizontal/Scroll/Template';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getPreviewItems();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _scrollMode: TScrollMode = 'scrollbar';
    protected _orientation: 'vertical' | 'horizontal' = 'horizontal';

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
        };
    }
}
