/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { ItemsEntity } from 'Controls/dragnDrop';
import { Move } from 'Controls/listCommands';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { DataSet, LOCAL_MOVE_POSITION } from 'Types/source';
import { TKey } from 'Controls/interface';
import * as cInstance from 'Core/core-instance';

interface IDragNDropProviderOptions {
    sourceController: SourceController;
    propertyValue: TKey | TKey[];
}

/**
 * Стандартный провайдер перемещения записей с помощью драг-н-дроп для редактора списка.
 * Для изменения стандартного поведения провайдера необходимо отнаследоваться от этого класса и переопределить методы.
 * @public
 */

export default class DragNDropProvider {
    private _options: IDragNDropProviderOptions;

    constructor(options?: IDragNDropProviderOptions) {
        this._options = options;
    }

    update(options?: IDragNDropProviderOptions): void {
        this._options = options;
    }

    getEntity(items: RecordSet): ItemsEntity {
        return new ItemsEntity({
            items,
        });
    }

    changeDragTarget(
        entity: ItemsEntity,
        item: Model,
        position: LOCAL_MOVE_POSITION
    ): boolean | void {
        return true;
    }

    dragEnter(entity: ItemsEntity): boolean {
        return cInstance.instanceOfModule(entity, 'Controls/dragnDrop:ItemsEntity');
    }

    dragEnd(
        items: ItemsEntity,
        target: Model,
        position: LOCAL_MOVE_POSITION
    ): Promise<void | DataSet> {
        const selection = {
            selected: items.getItems(),
            excluded: [],
        };
        return this._getMoveAction().execute({
            selection,
            targetKey: target.getKey(),
            position,
        });
    }

    afterItemsMove(items?: RecordSet): Promise<void> | void {
        this._options.sourceController.reload();
    }

    private _getMoveAction(): Move {
        return new Move({
            source: this._options.sourceController.getSource(),
            parentProperty: this._options.sourceController.getParentProperty(),
        });
    }
}
