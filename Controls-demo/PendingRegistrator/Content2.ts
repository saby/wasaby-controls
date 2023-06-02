import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/PendingRegistrator/Content2';
import { IoC } from 'Env/Env';
import {Deferred} from 'Types/deferred';

const timeout = 3000;

export default class Content2 extends Control {
    protected _template: TemplateFunction = template;
    // eslint-disable-next-line @typescript-eslint/ban-types
    protected _def: Deferred<unknown> = null;

    protected _register(): void {
        if (!this._def) {
            const def = new Deferred();
            this._notify('registerPending', [def], { bubbling: true });
            this._def = def;
        } else {
            IoC.resolve('ILogger').error(
                'Controls-demo/PendingRegistrator/Content2',
                'Pending registered already.'
            );
        }
    }

    protected _finish(): void {
        this._notify('finishingPendingProcess', [timeout], { bubbling: true });
        setTimeout(() => {
            if (!this._def.isReady()) {
                this._notify('finishedPendingProcess', [timeout], {
                    bubbling: true,
                });
                this._def.callback(true);
            }
            this._def = null;
        }, timeout);
    }

    protected _cancel(): void {
        this._notify('cancelFinishingPending', [], { bubbling: true });
    }

    static _styles = ['Controls-demo/PendingRegistrator/Content2'];
}
