import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemClick/Base/ItemClick';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];
    protected _hasMultiSelect: boolean = false;
    protected _selectedKeys: number[] = [];
    protected _clickedItem: string;
    protected _activeItem: string;

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

    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        this._clickedItem = item ? 'key: ' + item.getKey() : null;
    }

    protected _onItemActivate(e: SyntheticEvent, item: Model, nativeEvent: SyntheticEvent): void {
        this._activeItem = nativeEvent.target
            ? 'item-key: ' + nativeEvent.target.closest('[item-key]').getAttribute('item-key')
            : null;
    }
}
