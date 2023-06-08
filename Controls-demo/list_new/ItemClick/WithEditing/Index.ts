import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemClick/WithEditing/WithEditing';
import { Memory } from 'Types/source';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];
    protected _hasMultiSelect: boolean = false;
    protected _textsInfo: string[] = [];
    protected _selectedKeys: number[] = [];

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

    protected _beforeMount(): void {
        this._itemActions = getItemActions();
    }

    protected _onItemClick(): void {
        this._textsInfo.push('itemClick()');
    }

    protected _onItemActivate(): void {
        this._textsInfo.push('itemActivate()');
    }

    protected _clear(): void {
        this._textsInfo = [];
    }
}
