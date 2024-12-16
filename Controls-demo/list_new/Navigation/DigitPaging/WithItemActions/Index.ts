import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/DigitPaging/WithItemActions/WithItemActions';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../../DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';

interface IItem {
    title: string;
    key: number | string;
}

function getData(): IItem[] {
    return generateData({
        count: 100,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с идентификатором ${item.key} и каким то не очень длинным текстом`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationDigitPagingWithItemActions2: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'pages',
                        sourceConfig: {
                            pageSize: 10,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            totalInfo: 'extended',
                        },
                    },
                },
            },
        };
    }
}
