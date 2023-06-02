import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/3xl/Template';

import { DATA } from 'Controls-demo/tileNew/DataHelpers/HorizontalImageSize';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: DATA,
        });
    }
}
