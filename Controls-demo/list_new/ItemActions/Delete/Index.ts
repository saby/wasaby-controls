import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/Delete/Index';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { ISelectionObject } from 'Controls/interface';
import { IRemovableList, View } from 'Controls/list';
import { IItemAction } from 'Controls/itemActions';
import { IoC } from 'Env/Env';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[];
    protected _children: {
        list: View;
    };

    protected _beforeMount(): void {
        this._itemActions = [
            {
                id: 'deleteItem',
                icon: 'icon-Erase icon-error',
                handler: (item: Model) => {
                    const selection: ISelectionObject = {
                        selected: [item.getKey()],
                        excluded: [],
                    };
                    (this._children.list as undefined as IRemovableList)
                        .removeItems(selection)
                        .then(() => {
                            this._children.list.reload();
                        })
                        .catch((error) => {
                            IoC.resolve('ILogger').error(error);
                        });
                },
            },
        ];
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 0,
                    title: 'Element',
                },
                {
                    key: 1,
                    title: 'Another element',
                },
            ],
        });
    }
}
