import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/operations/SelectedCountConfig/SelectedCountConfig';
import { Memory, HierarchicalMemory } from 'Types/source';
import { default as CountSource } from 'Controls-demo/operations/resources/Source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    _template: TemplateFunction = template;
    _gridColumns: object[] = null;
    _viewSource: Memory = null;
    _selectedCountConfig: object = null;
    _filter: object = null;
    _selectedKeys: number[] = null;
    _excludedKeys: number[] = null;

    _beforeMount(): void {
        this._selectedKeys = [];
        this._excludedKeys = [];
        this._filter = {};
        this._gridColumns = Flat.getColumns();
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: Flat.getData(),
        });
        this._selectedCountConfig = {
            rpc: new CountSource({
                data: Flat.getData(),
            }),
            command: 'demoGetCount',
            data: {
                filter: this._filter,
            },
        };
    }
}
