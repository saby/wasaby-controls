import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import { _departments } from 'Controls-demo/Lookup/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Lookup/FlatListSelectorWithTabs/resources/DepartmentsTemplate');

interface IOptions extends IControlOptions {
    filter: object;
    selectComplete: () => void;
}

export default class extends Control<IOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _keyProperty: string = 'department';
    protected _beforeMount(options: IOptions): void {
        const keyProperty = this._keyProperty;
        this._filter = { ...options.filter };
        this._source = new Memory({
            data: _departments,
            filter(item, queryFilter) {
                const selectionFilterFn = (optItem, filter) => {
                    let isSelected = false;
                    const itemId = optItem.get('department');

                    filter.selection.get('marked').forEach((selectedId) => {
                        if (
                            selectedId === itemId ||
                            (selectedId === null &&
                                filter.selection
                                    .get('excluded')
                                    .indexOf(itemId) === -1)
                        ) {
                            isSelected = true;
                        }
                    });

                    return isSelected;
                };
                const normalFilterFn = MemorySourceFilter();

                return queryFilter.selection
                    ? selectionFilterFn(item, queryFilter)
                    : normalFilterFn(item, queryFilter);
            },
            keyProperty,
        });
    }
    protected _beforeUpdate(options: IOptions): void {
        if (options.selectComplete) {
            this._children.SelectorController._selectComplete();
        }
    }
}
