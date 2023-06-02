import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';

import { generateData } from '../../DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/Grouped/NoStickyLoadUp/NoStickyLoadUp';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';

const NUMBER_OF_ITEMS = 200;

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _dataArray: { key: number; title: string; group: string }[];
    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._navigation = {
            view: 'infinity',
            source: 'page',
            sourceConfig: {
                pageSize: 20,
                page: 5,
                hasMore: false,
            },
        };
        this._dataArray = generateData<{
            key: number;
            title: string;
            group: string;
        }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string' },
            beforeCreateItemCallback: (item) => {
                item.group = item.key > 100 ? '> 100' : '<= 100';
                item.title = `Запись с id="${item.key}". `;
            },
        });
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }
}
