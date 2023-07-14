/**
 * @kaizen_zone 76d0517f-7dae-4c08-9a57-f5b6e1cc9bfe
 */
import AbstractStrategy from './AbstractStrategy';
import { CrudEntityKey } from 'Types/source';
import { IMarkerStrategyOptions } from 'Controls/_marker/interface';

export default class SingleColumnMarkerStrategy extends AbstractStrategy {
    protected _moveMarkerOnScrollPaging: boolean;

    constructor(options: IMarkerStrategyOptions) {
        super(options);
        this._moveMarkerOnScrollPaging = options.moveMarkerOnScrollPaging;
    }

    getMarkedKeyByDirection(index: number, direction: string): CrudEntityKey | void {
        const next = direction === 'Down' || direction === 'Right' || direction === 'Forward';
        const resIndex = next ? index + 1 : index - 1;
        return this._calculateNearbyItem(resIndex, next);
    }
    getNextMarkedKey(index: number): CrudEntityKey | void {
        return this._calculateNearbyItem(index, true);
    }

    getPrevMarkedKey(index: number): CrudEntityKey | void {
        return this._calculateNearbyItem(index, false);
    }

    shouldMoveMarkerOnScrollPaging(): boolean {
        return this._moveMarkerOnScrollPaging !== false;
    }

    private _calculateNearbyItem(index: number, next: boolean): CrudEntityKey {
        let item;
        const count = this._model.getCount();
        const indexInBounds = (i) => {
            return next ? i < count : i >= 0;
        };
        let resIndex = index;
        while (indexInBounds(resIndex)) {
            item = this._model.at(resIndex);
            if (item && item.Markable) {
                break;
            }
            resIndex += next ? 1 : -1;
        }

        if (item && item.Markable) {
            return item.key;
        }

        return null;
    }
}
