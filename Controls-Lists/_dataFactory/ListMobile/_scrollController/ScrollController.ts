import type { Collection as ICollection } from 'Controls/display';
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
import type { SourceController as ISourceController } from '../_sourceController/SourceController';

export class ScrollController {
    _getCollection: () => ICollection | ITreeGridCollection;
    _getSourceController: () => ISourceController;

    setCollection(getter: () => ICollection | ITreeGridCollection) {
        this._getCollection = getter;
        return this;
    }

    setSourceController(getter: () => ISourceController) {
        this._getSourceController = getter;
        return this;
    }

    getForwardKey() {
        const sourceController = this._getSourceController();
        const collection = this._getCollection();
        const { limit } = sourceController.getPagination();
        const lastItem = collection.getLast();
        if (!lastItem) {
            return null;
        }
        const lastIndex = lastItem.index;
        const forwardIndex = Math.ceil(Math.max(0, lastIndex - limit * 0.66));
        return collection.at(forwardIndex).key;
    }

    getBackwardKey() {
        const sourceController = this._getSourceController();
        const collection = this._getCollection();
        const { limit } = sourceController.getPagination();
        const firstItem = collection.getFirst();
        if (!firstItem) {
            return null;
        }
        const firstIndex = firstItem.index;
        const backwardIndex = Math.ceil(
            Math.min(Math.max(collection.getCount() - 1, 0), firstIndex + limit * 0.66)
        );
        return collection.at(backwardIndex).key;
    }
}
