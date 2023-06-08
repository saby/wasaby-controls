/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control, TemplateFunction } from 'UI/Base';
import { controller as localeController } from 'I18n/i18n';

import template = require('wml!Controls/_breadcrumbs/HeadingPath/Back');
import 'css!Controls/heading';
import 'css!Controls/breadcrumbs';

class Back extends Control {
    protected _template: TemplateFunction = template;
    protected _isReverse: boolean;

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._isReverse =
            localeController.currentLocaleConfig.directionality === 'rtl';
    }

    /**
     * Presently, the only way to subscribe to a non-bubbling event is to create control in a wml file and subscribe there.
     * But, sometimes we use this control in the header of a list. Because the header is dynamic, we can't create it in a wml file, therefore it's impossible to make a subscription there.
     * So, all the events from this control should bubble, and it's parent should make sure that they don't propagate higher than it's necessary.
     */
    _onBackButtonClick(): void {
        this._notify('backButtonClick', [], {
            bubbling: true,
        });
    }

    _onArrowClick(): void {
        this._notify('arrowClick', []);
    }

    static _styles: string[] = ['Controls/_breadcrumbs/resources/FontLoadUtil'];
}

export default Back;
