/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/ListContainerEventProxy';

/**
 * Обертка для Controls/listDataOld:Container, чтобы убрать у событий префикс list (например listRootChanged -> rootChanged).
 * @private
 * @class Controls/_browser/resources/ListContainerEventProxy
 */

export default class ListContainerEventProxy extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    private _notifyProxy(event: Event, eventName: string, ...args: unknown[]): void {
        event.stopPropagation();
        this._notify(eventName, args);
    }
}
