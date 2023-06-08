import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Menu/Control/Source/resources/StackTemplate';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

interface IOptions extends IControlOptions {
    items: object[];
    selectedItems: RecordSet;
}

export default class extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _itemsMore: object[];
    protected _sourceMore: Memory;
    private _selectionChanged: boolean = false;
    private _filter: object;

    protected _beforeMount(options: IOptions): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: options.items,
            filter: (item, queryFilter) => {
                if (queryFilter.selection) {
                    const itemId = String(item.get('id'));
                    const marked = queryFilter.selection.get('marked');
                    let isSelected = false;
                    marked.forEach((selectedId) => {
                        if (String(selectedId) === itemId) {
                            isSelected = true;
                        }
                    });
                    return isSelected;
                }
                return true;
            },
        });
        this._selectionChanged = options.selectedItems.getCount() > 0;
        this._filter = {};
    }

    protected _selectedKeysChanged(): void {
        this._selectionChanged = true;
    }

    protected _selectComplete(): void {
        this._children.SelectorController._selectComplete();
    }

    static _styles: string[] = [
        'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',
    ];
}
