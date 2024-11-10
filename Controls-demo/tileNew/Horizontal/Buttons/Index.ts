import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/Horizontal/Buttons/Template';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getPreviewItems();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _tileWidthSource: Memory;
    protected _tileWidth: number = 200;

    protected _beforeMount(): void {
        this._tileWidthSource = new Memory({
            keyProperty: 'id',
            data: [{ id: 200 }, { id: 1000 }],
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
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
