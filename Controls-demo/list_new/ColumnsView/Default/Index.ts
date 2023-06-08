import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/Default/Default');
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'UI/Vdom';
import { ItemsEntity } from 'Controls/dragnDrop';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';

const NUMBER_OF_ITEMS = 1000;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;

    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;

    private _dataArray: { key: number; title: string }[];

    protected _beforeMount(): void {
        this._dataArray = generateData<{ key: number; title: string }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". `;
            },
        });
        this._viewSource = new MemorySource({
            data: this._dataArray,
            keyProperty: 'key',
        });
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                page: 0,
                pageSize: 100,
                hasMore: false,
            },
        };
    }

    protected _dragStart(e: SyntheticEvent, items: string[]): ItemsEntity {
        return new ItemsEntity({ items });
    }
}
