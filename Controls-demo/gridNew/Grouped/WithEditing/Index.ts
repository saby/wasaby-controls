import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/WithEditing/WithEditing';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/Grouped/WithEditing/_cellEditor';
import { IColumn } from 'Controls/grid';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IItemAction } from 'Controls/itemActions';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Tasks;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Tasks.getDefaultWithEditingColumns();
    protected _itemActions: IItemAction[] = getItemActions();

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
