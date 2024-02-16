import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getColorsData as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/hoverBackgroundStyle/hoverBackgroundStyle';
import { TBackgroundStyle } from 'Controls/interface';

export default class extends Control {
    protected _itemActions: IItemAction[] = getItemActions().slice(1);
    protected _template: TemplateFunction = Template;
    protected _hoverBackgroundStyle: TBackgroundStyle;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplatehoverBackgroundStyle: {
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
}
