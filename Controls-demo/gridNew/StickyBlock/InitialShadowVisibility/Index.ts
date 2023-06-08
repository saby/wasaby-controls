import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/StickyBlock/InitialShadowVisibility/InitialShadowVisibility';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData({
        count: 200,
        entityTemplate: { title: 'lorem' },
    }).map((it, index) => {
        return { ...it, group: Math.round(index / 10) };
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
    protected _columns: [] = [
        {
            displayProperty: 'title',
            width: 'max-content',
        },
    ];
    protected _header: [] = [{ title: 'Lorem' }];

    protected _onReload(): void {
        this._children.list.reload();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
                    navigation: {
                        storeId: 'listData',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 30,
                            page: 4,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}
