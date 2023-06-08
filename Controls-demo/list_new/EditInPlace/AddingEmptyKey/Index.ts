import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AddingEmptyKey/AddingEmptyKey';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { View as List } from 'Controls/list';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _fakeItemId: number = 1000;

    protected _children: {
        list: List;
    };

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _beginAdd(): void {
        this._children.list.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: { key: null, title: '' },
            }),
        });
    }

    protected _onBeforeEndEdit(e: Event, item: Model, isAdd: boolean): void {
        if (isAdd && item.getKey() === null) {
            item.set('key', ++this._fakeItemId);
        }
    }
}
