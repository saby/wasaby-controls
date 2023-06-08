import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/ScrollToItem/ScrollToItem';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IItem {
    key: number;
    title: string;
}

function getData(): IItem[] {
    return generateData<IItem>({
        keyProperty: 'key',
        count: 1000,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

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
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 100,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'hidden',
                        },
                    },
                },
            },
        };
    }

    protected _scrollToItem(event: SyntheticEvent, key: number, position: string): void {
        this._children.list.scrollToItem(key, position, true);
    }
}
