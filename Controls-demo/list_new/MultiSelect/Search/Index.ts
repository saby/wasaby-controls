import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';
import {
    INavigationSourceConfig,
    INavigationOptionValue,
} from 'Controls/interface';

import { default as CountSource } from 'Controls-demo/list_new/MultiSelect/Search/CountSource';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/list_new/MultiSelect/Search/Search';

const DATA = generateData({
    count: 100,
    entityTemplate: { title: 'lorem' },
});

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        view: 'infinity',
        source: 'page',
        sourceConfig: {
            pageSize: 20,
            page: 0,
            hasMore: false,
        },
    };
    protected _selectedCountConfig = {
        rpc: new CountSource({ data: DATA }),
        command: 'demoGetCount',
        data: {},
    };

    protected _selectedKeys: number[] = [];
    protected _excludedKeys: number[] = [];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: DATA,
            filter: (item: Record, filter: { title: string }) => {
                if (!filter || !filter.title) {
                    return true;
                }

                const itemTitle = item.get('title').toLowerCase();
                const searchValue = filter.title.toLowerCase();
                return itemTitle.includes(searchValue);
            },
        });
    }

    protected _toStringArray(array: unknown[]): string {
        return array
            .map((it) => {
                return String(it);
            })
            .join();
    }
}
