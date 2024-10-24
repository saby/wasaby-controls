import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionClickHandler/ItemActionClickHandler';
import 'css!Controls-demo/list_new/ItemActions/ItemActionClickHandler/ItemActionClickHandler';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _clickedMessage: string;
    private _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionClickHandler: {
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
        this._itemActions[0].handler = (item: Model): void => {
            this._clickedMessage = `У операции "Прочитано" отдельный обработчик. Элемент с id=${item.getId()}.`;
        };
    }

    protected _actionClick(e: SyntheticEvent<null>, itemAction: IItemAction, item: Model): void {
        this._clickedMessage = `Кликнули на операцию "${
            itemAction.title
        }" у элемента с id="${item.getKey()}".`;
    }

    protected _clearMessage(): void {
        this._clickedMessage = '';
    }
}
