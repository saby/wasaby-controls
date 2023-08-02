/**
 * @kaizen_zone 76d0517f-7dae-4c08-9a57-f5b6e1cc9bfe
 */
import AbstractStrategy from './AbstractStrategy';
import { CrudEntityKey } from 'Types/source';

export default class MultiColumnMarkerStrategy extends AbstractStrategy {
    getMarkedKeyByDirection(index: number, direction: string): CrudEntityKey | void {
        const curMarkedItem = this._model.at(index);
        const itemFromDirection = this._model[`getItemTo${direction}`](curMarkedItem);
        return itemFromDirection ? itemFromDirection.getContents().getKey() : null;
    }

    getNextMarkedKey(index: number): CrudEntityKey | void {
        const markedItem = this._model.find((item) => {
            return item.isMarked();
        });
        let resIndex = index;
        if (!markedItem && this._model.getColumnsMode() !== 'fixed') {
            resIndex -= 1;
        }
        if (resIndex >= 0) {
            return this.getMarkedKeyByDirection(resIndex, 'Right');
        } else {
            return null;
        }
    }

    getPrevMarkedKey(index: number): CrudEntityKey | void {
        if (index > 0) {
            return this.getMarkedKeyByDirection(index, 'Left');
        } else {
            return null;
        }
    }

    shouldMoveMarkerOnScrollPaging(): boolean {
        return false;
    }
}
