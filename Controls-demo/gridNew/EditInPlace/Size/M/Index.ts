import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/Size/M/M';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/EditInPlace/Size/M/_cellEditor';
import { RecordSet } from 'Types/collection';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingAlignData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumnRes[] = Editing.getEditingSizeColumns('M');
    protected _items: RecordSet;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceSizeM: {
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
