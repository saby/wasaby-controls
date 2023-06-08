import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/Delete/Index';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { ISelectionObject } from 'Controls/interface';
import { IRemovableList, View } from 'Controls/list';
import { IItemAction } from 'Controls/itemActions';
import { IoC } from 'Env/Env';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 0,
            title: 'Element',
        },
        {
            key: 1,
            title: 'Another element',
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];
    protected _children: {
        list: View;
    };

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
    }
}
