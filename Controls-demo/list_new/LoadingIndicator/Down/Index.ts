import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/LoadingIndicator/Down/Down';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from '../../DemoHelpers/DataCatalog';

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

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
        slowDownSource(this._viewSource, TIMEOUT3500);
    }
}
