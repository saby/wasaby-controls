import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';

import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/EditingTemplateFromColumn';
import 'css!Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/EditingTemplateFromColumn';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
