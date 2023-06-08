import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsCells/CustomResultsCells';
import * as resTpl from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsCells/resultCell';
import { HierarchicalMemory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _header: IHeaderCell[] = Flat.getHeader();
    protected _columns: IColumn[] = Flat.getColumns().map((c, i) => {
        return {
            ...c,
            result: undefined,
            resultTemplate: i === 1 ? resTpl : undefined,
        };
    });
    private _fullResultsIndex: number = 0;
    private _items: RecordSet;

    constructor() {
        super({});
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: Flat.getData(),
        });
    }

    private _dataLoadCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: this._generateResults(items),
        });
    }

    private _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    private _updateMeta(): void {
        this._children.tree.reload();
    }

    private _setMeta(): void {
        this._items.setMetaData({
            ...this._items.getMetaData(),
            results: this._generateResults(this._items),
        });
    }

    private _generateResults(items: RecordSet): Model {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [{ name: 'rating', type: 'real' }],
        });

        const data = Flat.getResults().full[this._fullResultsIndex];
        results.set('rating', data.rating);
        this._fullResultsIndex =
            ++this._fullResultsIndex % Flat.getResults().full.length;
        return results;
    }
}
