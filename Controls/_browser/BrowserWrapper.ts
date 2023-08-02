/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/BrowserWrapper';
import { default as ControlsBrowser } from 'Controls/_browser/Browser';
import { ControllerClass as FilterController } from 'Controls/filter';

export default class BrowserWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    // @ts-ignore
    protected _children: Record<string, ControlsBrowser> = {
        // @ts-ignore
        browser: ControlsBrowser,
    };

    resetPrefetch(): void {
        return this._children.browser.resetPrefetch();
    }

    getFilterController(listId?: string): FilterController {
        return this._children.browser.getFilterController(listId);
    }
}
