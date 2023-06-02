import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/LoadingIndicator/Up/Up';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';

const TIMEOUT3500 = 3500;
interface IItem {
    title: string;
    key: string | number;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _dataArray: { key: number; title: string }[] = generateData<{
        key: number;
        title: string;
    }>({
        count: 100,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись списка с id = ${item.key}.`;
        },
    });
    private _items: RecordSet;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
        slowDownSource(this._viewSource, TIMEOUT3500);
    }

    protected _saveItems = (items: RecordSet) => {
        this._items = items;
    };

    protected _removeTopItem = () => {
        this._items.removeAt(0);
    };

    protected _changeTopItem = () => {
        this._items
            .at(0)
            .set(
                'title',
                'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. ' +
                    'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. ' +
                    'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. ' +
                    'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст.'
            );
    };
}
