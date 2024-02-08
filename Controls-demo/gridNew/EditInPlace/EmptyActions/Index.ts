import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EmptyActions/EmptyActions';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/_cellEditor';
import { IColumn } from 'Controls/grid';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Editing.getEditingColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceEmptyActions: {
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
