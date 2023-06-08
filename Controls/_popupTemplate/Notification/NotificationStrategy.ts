/**
 * @kaizen_zone c7f0da9e-2888-4829-ad87-bd0d8c22d857
 */
import getDirection from 'Controls/_popupTemplate/Util/getDirection';

export class NotificationStrategy {
    private _horizontalPosition: string = getDirection('right');
    getPosition(offsetRight: number, offsetBottom: number): object {
        return {
            [this._horizontalPosition]: offsetRight,
            bottom: offsetBottom,
        };
    }
}

export default new NotificationStrategy();
