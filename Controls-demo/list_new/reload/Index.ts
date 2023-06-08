import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/reload/Template';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

interface IItem {
    title: string;
    key: number | string;
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _position: number = 0;
    protected _paramsForReload: object = null;
    protected _reloadsCount: number = 0;
    protected _dataLoadCallback: Function;
    private _dataArray: unknown = generateData({
        count: 300,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с идентификатором ${item.key}`;
        },
    });
    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
        this._dataLoadCallback = (list) => {
            list.each((item) => {
                item.set(
                    'title',
                    `Запись с идентификатором ${item.get(
                        'key'
                    )}.  Количество перезагрузок: ${this._reloadsCount}`
                );
            });
        };
    }
    protected _reload() {
        this._reloadsCount++;
        this._children.list.reload(true);
    }
}
