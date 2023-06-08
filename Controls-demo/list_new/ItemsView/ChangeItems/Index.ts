// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls-demo/list_new/ItemsView/ChangeItems/Index';
import { RecordSet } from 'Types/collection';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';

interface IRawData {
    key: number;
    title: string;
}

const format = {
    key: 'integer',
    title: 'string',
};

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;
    protected _keepScrollAfterReload: boolean = true;

    /**
     * id последней созданной строки
     */
    private _lastRowId: number = 0;

    protected _beforeMount(): void {
        this._resetRows();
    }

    /**
     * Пересоздает RecordSet данные которого отображаются списком
     */
    protected _resetRows(): void {
        this._lastRowId = 0;
        const rawData = [];
        const N = 30;
        for (let i = 0; i < N; i++) {
            rawData.push(this._generateRow());
        }
        this._items = new RecordSet({
            format,
            keyProperty: 'key',
            rawData,
        });
    }

    /**
     * Генерирует сырые данные для новой строки
     */
    private _generateRow(): IRawData {
        const key = ++this._lastRowId;
        return {
            key,
            title: `row with id ${key}`,
        };
    }

    static _styles: string[] = ['Controls-demo/list_new/ItemsView/Base/Index'];
}
