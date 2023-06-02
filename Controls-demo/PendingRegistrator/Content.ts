import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/PendingRegistrator/Content';
import { IoC } from 'Env/Env';
import {Deferred} from 'Types/deferred';

const timeout = 3000;

export default class Content extends Control {
    protected _template: TemplateFunction = template;
    // eslint-disable-next-line @typescript-eslint/ban-types
    protected _def: Deferred<unknown> = null;

    protected _register() {
        if (!this._def) {
            const def = new Deferred();
            this._notify(
                'registerPending',
                [
                    def,
                    {
                        onPendingFail: () => {
                            this._notify('finishingPendingProcess', [timeout], {
                                bubbling: true,
                            });
                            setTimeout(() => {
                                if (!def.isReady()) {
                                    this._notify(
                                        'finishedPendingProcess',
                                        [timeout],
                                        { bubbling: true }
                                    );
                                    def.callback(true);
                                }
                                this._def = null;
                            }, timeout);
                        },
                    },
                ],
                { bubbling: true }
            );
            this._def = def;
        } else {
            IoC.resolve('ILogger').error(
                'Controls-demo/PendingRegistrator/Content',
                'Pending registered already.'
            );
        }
    }

    static _styles = ['Controls-demo/PendingRegistrator/Content'];
}
