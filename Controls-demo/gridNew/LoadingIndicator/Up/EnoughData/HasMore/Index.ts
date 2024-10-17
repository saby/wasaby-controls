import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/HasMore/HasMore';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData({
        count: 60,
        entityTemplate: { title: 'lorem' },
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

    protected _initialScrollPosition: object = {
        vertical: 'end',
    };

    protected _onReload(): void {
        this._children.list.reload();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorUpEnoughDataHasMore: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 20,
                            page: 2,
                            hasMore: false,
                            direction: 'backward',
                        },
                    },
                },
            },
        };
    }
}
