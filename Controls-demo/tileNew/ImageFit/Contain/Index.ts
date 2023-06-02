import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/ImageFit/Contain/Contain';
import { items } from 'Controls-demo/tileNew/ImageFit/resources/DataCatalog';
import { HierarchicalMemory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: items,
        });
    }
}
