import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/KeepScrollAfterReload/KeepScrollAfterReload';
import { CrudEntityKey, Memory } from 'Types/source';
import { generateData } from '../DemoHelpers/DataCatalog';

interface IItem {
    title: string;
    key: CrudEntityKey;
    filtered: boolean;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _filter: object;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: generateData({
                count: 50,
                beforeCreateItemCallback: (item: IItem) => {
                    item.title = `${item.key}) item`;
                    item.filtered = true;
                },
            }),
        });
    }

    protected _changeFilter(): void {
        if (!this._filter) {
            this._filter = { filtered: true };
        } else {
            this._filter = null;
        }
    }
}
