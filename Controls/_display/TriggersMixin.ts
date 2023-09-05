/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
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
