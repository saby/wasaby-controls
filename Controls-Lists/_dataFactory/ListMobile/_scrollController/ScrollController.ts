/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
        if (collection.getCount() === 0) {
            return null;
        }

        const shiftSize = Math.ceil(limit / 5);

        return collection.at(Math.min(collection.getCount(), shiftSize)).key;
    }

    getBackwardKey() {
        const sourceController = this._getSourceController();
        const collection = this._getCollection();
        const { limit } = sourceController.getPagination();
        if (collection.getCount() === 0) {
            return null;
        }

        const shiftSize = Math.ceil(limit / 5);
        const lastIndex = collection.getCount() - 1;
        const prepIndex = lastIndex - shiftSize;

        return collection.at(Math.max(shiftSize, prepIndex)).key;
    }
}
