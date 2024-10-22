import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/Edge/Edge';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../DemoHelpers/DataCatalog';

function getData() {
    return generateData({
        count: MAX_ELEMENTS_COUNT,
        entityTemplate: { title: 'lorem' },
    });
}

const MAX_ELEMENTS_COUNT: number = 60;
const TIMEOUT = 20;

/**
 * Отображение пейджинга с одной командой прокрутки.
 * Отображается кнопка в конец, либо в начало, в зависимости от положения.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationPagingEdge: {
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
                            pageSize: 60,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'edge',
                        },
                    },
                },
            },
        };
    }

    protected _afterMount(): void {
        setTimeout(() => {
            this._children.list.scrollToItem(MAX_ELEMENTS_COUNT - 1, 'bottom', true);
        }, TIMEOUT);
    }
}
