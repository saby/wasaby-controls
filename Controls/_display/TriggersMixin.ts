/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import Trigger, { IOptions as ITriggerOptions } from 'Controls/_display/Trigger';

export default abstract class TriggersMixin {
    private _triggerModule: string;
    private _topTrigger: Trigger;
    private _bottomTrigger: Trigger;

    getTopTrigger(): Trigger {
        if (!this._topTrigger) {
            this._topTrigger = this.createItem({
                itemModule: this._triggerModule,
                position: 'top',
            });
        }

        return this._topTrigger;
    }

    getBottomTrigger(): Trigger {
        if (!this._bottomTrigger) {
            this._bottomTrigger = this.createItem({
                itemModule: this._triggerModule,
                position: 'bottom',
            });
        }

        return this._bottomTrigger;
    }

    abstract createItem(options: ITriggerOptions): Trigger;
}

Object.assign(TriggersMixin.prototype, {
    'Controls/display:TriggersMixin': true,
    _triggerModule: 'Controls/display:Trigger',
    _topTrigger: null,
    _bottomTrigger: null,
});
