import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { data } from '../Data';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TileSize/l/Template';

/**
 * Демка для автотеста https://online.sbis.ru/opendoc.html?guid=cfdc419f-4bc2-4d18-9733-cb2a330e4898
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data,
        });
    }
}
