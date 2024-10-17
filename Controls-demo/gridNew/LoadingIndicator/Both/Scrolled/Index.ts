import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/Scrolled/Scrolled';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
    });
}

function getSource(): Memory {
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

    protected _afterMount(options?: {}, contexts?: any): void {
        super._afterMount(options, contexts);
        this._children.list.scrollToItem(45);
    }

    protected _onReload(): void {
        this._children.list.reload();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorBothScrolled: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
                },
                navigation: {
                    source: 'page',
                    view: 'infinity',
                    sourceConfig: {
                        pageSize: 30,
                        page: 1,
                        hasMore: false,
                    },
                },
            },
        };
    }
}
