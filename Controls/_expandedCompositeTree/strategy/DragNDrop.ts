import { TreeStrategy } from 'Controls/listDragNDrop';
import type { Model } from 'Types/entity';
import type Collection from '../display/Collection';
import type CollectionItem from '../display/CollectionItem';

export class DragNDropStrategy extends TreeStrategy {
    protected _getTargetIndex(targetItem: CollectionItem): number {
        return (this._model as unknown as Collection<Model, CollectionItem>).getDeepIndex(
            targetItem
        );
    }
}
