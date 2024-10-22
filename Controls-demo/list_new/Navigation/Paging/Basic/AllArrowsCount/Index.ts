import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/Basic/AllArrowsCount/AllArrowsCount';
import PositionSourceMock from './PositionSourceMock';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

/**
 * Отображение пэйджинга с 4 кнопками и счетчиком записей.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: PositionSourceMock;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationPagingAllArrowsCount: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({
                        keyProperty: 'key',
                    }),
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'forward',
                            limit: 20,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                            showEndButton: true,
                        },
                    },
                },
            },
        };
    }
}
