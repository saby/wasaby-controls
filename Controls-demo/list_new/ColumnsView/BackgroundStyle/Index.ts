import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/BackgroundStyle/Template');
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';

const NUMBER_OF_ITEMS = 50;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    private _dataArray: { key: number; title: string; description: string }[];
    protected _beforeMount(): void {
        this._dataArray = generateData<{
            key: number;
            title: string;
            description: string;
            column: number;
        }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string', description: 'lorem' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". ${item.title}`;
            },
        });
        this._viewSource = new MemorySource({
            data: this._dataArray,
            keyProperty: 'key',
        });
    }
}
