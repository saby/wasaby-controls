import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/NotHasMore/NotHasMore';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData({
        count: 10,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = item.key + 1 + ') Запись с id = ' + item.key;
        },
    });
}

function getSource() {
    const source = new Memory({
        keyProperty: 'key',
        data: getData(),
    });
    slowDownSource(source, 2000);
    return source;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: [] = [{ displayProperty: 'title' }];

    protected _onReload(): void {
        this._children.list.reload();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            IndicatorDownNotEnoughDataNotHasMore: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
                    keyProperty: 'key',
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 10,
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}
