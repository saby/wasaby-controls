import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { getManyCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import * as Dnd from 'Controls/dragnDrop';

import * as Template from 'wml!Controls-demo/Scroll/Container/DnDAutoScroll/Index';

const MOVE_DELAY = 1000;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemsReadyCallback: (items: RecordSet) => void =
        this._itemsReady.bind(this);
    protected _selectedKeys: number[] = [];

    private _itemsFirst: RecordSet;

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    private _itemsReady(items: RecordSet): object {
        this._itemsFirst = items;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): Dnd.ItemsEntity {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items,
            title: firstItem.get('title'),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void | Promise<void> {
        this._children.listMover.moveItems(entity.getItems(), target, position);
    }
}
