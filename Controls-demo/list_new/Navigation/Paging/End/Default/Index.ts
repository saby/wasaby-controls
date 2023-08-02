import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/End/Default/End';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../../DemoHelpers/DataCatalog';

const MAX_ELEMENTS_COUNT: number = 60;
const TIMEOUT = 20;

function getData() {
    return generateData({
        count: MAX_ELEMENTS_COUNT,
        entityTemplate: { title: 'lorem' },
    });
}

/**
 * Отображение пейджинга с одной командой прокрутки. Отображается только кнопка в конец.
 */
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
                            pageSize: 60,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'end',
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
