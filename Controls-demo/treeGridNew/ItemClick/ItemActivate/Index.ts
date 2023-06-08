import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemClick/ItemActivate/ItemActivate';
import { HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: unknown[] = Flat.getColumns();

    protected _expandByItemClick: boolean = false;

    protected _clickedItem: string;
    protected _activeItem: string;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            parentProperty: 'parent',
            filter: (): boolean => {
                return true;
            },
        });
    }

    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        this._clickedItem = item ? `"key: ${item.getKey()}"` : null;
    }

    protected _onItemActivate(e: SyntheticEvent, item: Model, nativeEvent: SyntheticEvent): void {
        this._activeItem = item ? `"key: ${item.getKey()}"` : null;
    }

    protected _toggleExpandByItemClick(): void {
        this._expandByItemClick = !this._expandByItemClick;
    }
}
