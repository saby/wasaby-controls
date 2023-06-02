import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ISelectionObject } from 'Controls/interface';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';
import * as Dnd from 'Controls/dragnDrop';

import * as Template from 'wml!Controls-demo/list_new/DragNDrop/DragNDrop';

const MOVE_DELAY = 1000;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemsReadyCallback: (items: RecordSet) => void =
        this._itemsReady.bind(this);
    protected _selectedKeys: number[] = [];

    private _itemsFirst: RecordSet;
    private _multiselect: 'visible' | 'hidden' = 'hidden';
    private _slowMoveMethod: boolean;

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

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): void {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items,
            title: firstItem.get('title'),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Dnd.ItemsEntity,
        target: Model,
        position: string
    ): void | Promise<void> {
        const selection: ISelectionObject = {
            selected: entity.getItems(),
            excluded: [],
        };
        if (this._slowMoveMethod) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this._children.list.moveItems(
                        selection,
                        target.getKey(),
                        position
                    );
                    resolve();
                }, MOVE_DELAY);
            });
        } else {
            this._children.list.moveItems(selection, target.getKey(), position);
        }
    }

    protected _onToggle(): void {
        this._multiselect =
            this._multiselect === 'visible' ? 'hidden' : 'visible';
    }

    protected _onSlowMoveMethod(): void {
        this._slowMoveMethod = !this._slowMoveMethod;
    }
}
