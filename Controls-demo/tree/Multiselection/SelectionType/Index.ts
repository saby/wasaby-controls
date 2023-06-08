import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/Multiselection/SelectionType/SelectionType';
import { HierarchicalMemory } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data,
            filter: () => {
                return true;
            },
        });
    }
}
