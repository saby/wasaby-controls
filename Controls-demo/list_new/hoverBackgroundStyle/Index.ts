import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { TBackgroundStyle } from 'Controls/interface';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/list_new/hoverBackgroundStyle/hoverBackgroundStyle';
import 'css!Controls-demo/list_new/hoverBackgroundStyle/hoverBackgroundStyle';

export default class extends Control {
    protected _itemActions: IItemAction[] = getItemActions().slice(1);
    protected _template: TemplateFunction = Template;
    protected _hoverBackgroundStyle: TBackgroundStyle;

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
        this._hoverBackgroundStyle = 'primary';
    }

    protected _toggleHoverBackground() {
        this._hoverBackgroundStyle =
            this._hoverBackgroundStyle === 'primary' ? 'success' : 'primary';
    }
}
