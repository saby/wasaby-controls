import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/VirtualScrollWithGroups/VirtualScrollWithGroups');
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { IVirtualScrollConfig } from 'Controls/list';

const NUMBER_OF_ITEMS = 200;
const COUNT_ITEMS_IN_GROUP = 50;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;

    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            page: 0,
            pageSize: 30,
            hasMore: false,
        },
    };

    protected _virtualScrollConfig: IVirtualScrollConfig = {
        pageSize: 30,
    };

    protected _items: RecordSet;

    protected _beforeMount(): void {
        const data = generateData<{
            key: number;
            title: string;
            description: string;
            group: number;
        }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string', description: 'lorem' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". ${item.title}`;
            },
        });
        let groupId = 0;
        data.forEach((item, index) => {
            item.group = `Группа ${groupId}`;
            if (index !== 0 && index % COUNT_ITEMS_IN_GROUP === 0) {
                groupId++;
            }
        });
        this._viewSource = new MemorySource({
            data,
            keyProperty: 'key',
        });
    }
}
