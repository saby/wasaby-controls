import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/SequentialEditingMode/SequentialEditingMode';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/_cellEditor';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumnRes[] = Editing.getEditingColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceSequentialEditingMode: {
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
