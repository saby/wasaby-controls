/**
 * @kaizen_zone f4aee25a-8072-469d-b51f-fa0b1c29931d
 */
import getDirection from 'Controls/_popupTemplateStrategy/Util/getDirection';

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
