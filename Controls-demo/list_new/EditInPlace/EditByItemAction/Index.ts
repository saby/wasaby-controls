import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EditByItemAction/EditByItemAction';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return getFewCategories().slice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _itemActions: IItemAction[];

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
        this._itemActionEditClickHandler = this._itemActionEditClickHandler.bind(this);
        this._itemActionEditClickHandlerWithoutParams =
            this._itemActionEditClickHandlerWithoutParams.bind(this);

        this._itemActions = [
            {
                id: 1,
                icon: 'icon-Edit',
                title: 'Редактировать',
                showType: TItemActionShowType.TOOLBAR,
                handler: this._itemActionEditClickHandler,
            },
            {
                id: 2,
                title: 'Редактировать без параметра',
                showType: TItemActionShowType.TOOLBAR,
                handler: this._itemActionEditClickHandlerWithoutParams,
            },
        ];
    }

    protected _itemActionVisibilityCallback(
        action: IItemAction,
        item: Model,
        isEditing: boolean
    ): boolean {
        if (isEditing) {
            return false;
        } else if (action.id === 2) {
            return item.getKey() === 5;
        } else {
            return true;
        }
    }

    private _itemActionEditClickHandler(item: Model) {
        this._children.list.beginEdit({ item });
    }

    private _itemActionEditClickHandlerWithoutParams(item: Model) {
        this._children.list.beginEdit();
    }
}
