import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EmptyActionsWithToolBar/EmptyActionsWithToolBar';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IEditingConfig } from 'Controls/display';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';

function getData() {
    const data = getFewCategories().slice(0, 1);
    data[0].key = 1;
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _editingConfig: IEditingConfig = {
        toolbarVisibility: true,
        item: new Model({
            rawData: getData()[1],
        }),
        editOnClick: true,
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceEmptyActionsWithToolBar: {
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
