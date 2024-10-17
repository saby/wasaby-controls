import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/EdgesUpDirection/EdgesUpDirection';
import { Memory } from 'Types/source';
import { generateData } from '../../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAX_ELEMENTS_COUNT: number = 100;

function getData() {
    return generateData({
        count: MAX_ELEMENTS_COUNT,
        entityTemplate: { title: 'lorem' },
    });
}

/**
 * Отображение пейджинга с одной командой прокрутки.
 * Отображается кнопка в конец, либо в начало, в зависимости от положения.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationPagingEdgesUpDirection: {
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
                            pageSize: 20,
                            page: 4,
                            hasMore: false,
                        },
                        viewConfig: {
                            showEndButton: true,
                            pagingMode: 'edges',
                            pagingPadding: null,
                        },
                    },
                },
            },
        };
    }
}
