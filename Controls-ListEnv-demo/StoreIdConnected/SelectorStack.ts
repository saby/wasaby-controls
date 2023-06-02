import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/StoreIdConnected/SelectorStack';
import { Memory } from 'Types/source';
import { Controller } from 'Controls/lookupPopup';
import { TSelectionRecord } from 'Controls/interface';

interface ISelectorOptions extends IControlOptions {
    items: object[];
}

export default class extends Control<ISelectorOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _selectionChanged: boolean = false;
    protected _filter: object = {};
    protected _children: {
        SelectorController: Controller;
    };

    protected _beforeMount(options: ISelectorOptions): void {
        this._source = new Memory({
            keyProperty: 'post',
            data: options.items,
            filter: (item, queryFilter: { selection: TSelectionRecord }) => {
                if (queryFilter.selection) {
                    const itemId = String(item.get('post'));
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
        this._selectionChanged = false;
        this._filter = {};
    }

    protected _selectedKeysChanged(): void {
        this._selectionChanged = true;
    }

    protected _selectComplete(): void {
        this._children.SelectorController.selectComplete();
    }
}
