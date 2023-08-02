// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Template from 'wml!Controls-demo/gridNew/PaddingBottom/Index';
import {Memory} from 'Types/source';
import {IColumn} from 'Controls/grid';
import {Control, TemplateFunction} from 'UI/Base';
import {Countries} from '../DemoHelpers/Data/Countries';
import {IItemAction} from 'Controls/interface';
import {getActionsForContacts as getItemActions} from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import {IDataConfig, IListDataFactoryArguments} from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 6);
}

/**
 * Демка проверяет простановку нижнего отступа у GridView когда заданы itemActions в позиции outside
 * и подгрузка данных по кнопке "Еще..."
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Countries.getColumns();
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        this._itemActions = getItemActions();
    }

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
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    }
}
