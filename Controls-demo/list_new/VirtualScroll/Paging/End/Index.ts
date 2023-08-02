import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/Paging/End/End';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../DemoHelpers/DataCatalog';

function getData() {
    return generateData({
        count: 200,
        entityTemplate: { title: 'lorem' },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _count: number;

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
                            pageSize: 10,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            showEndButton: true,
                            pagingMode: 'end',
                        },
                    },
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._count = 199;
    }

    protected _updateCount(e: Event, key: number): void {
        this._count = 199 - key;
    }
}
