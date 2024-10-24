import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/Align/Align';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/EditInPlace/Align/_cellEditor';
import { RecordSet } from 'Types/collection';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingAlignData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumnRes[] = Editing.getEditingAlignColumns();
    protected _items: RecordSet;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceAlign: {
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
