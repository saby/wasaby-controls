import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import { getActionsForContacts } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import * as Template from 'wml!Controls-demo/gridNew/ItemTemplate/BackgroundColorStyle/BackgroundColorStyle';

const LASTITEM = 8;

function getData() {
    return Countries.getData().slice(0, LASTITEM);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths();
    protected _backgroundStyleMap: string[] = [
        'default',
        'unaccented',
        'primary',
        'secondary',
        'danger',
        'success',
        'warning',
        'info',
    ];
    protected _itemActions: IItemAction[] = getActionsForContacts();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateBackgroundColorStyle: {
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
