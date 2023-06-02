import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AutoAddOnInit/AutoAddOnInit';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _filter = { city: 'Yaroslavl' };

    protected _beforeMount(): void {
        this._viewSource = this._createSource();
    }

    private _createSource(): Memory {
        const source: Memory = new Memory({
            keyProperty: 'key',
            data: [],
        });

        // Эмуляция завязки БЛ на фильтр списка.
        const originCreate = source.create.bind(source);
        source.create = (meta) => {
            return originCreate(meta).then((item) => {
                item.set('title', 'New item in ' + meta.city);
                return item;
            });
        };

        return source;
    }
}
