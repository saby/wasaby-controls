import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_listDataOld/ListContainerEventConverter';
import { SyntheticEvent } from 'UICommon/Events';

const LIST_CONTAINER_EVENT_PREFIX = 'list';

export default class ListContainerEventConverter extends Control {
    _template: TemplateFunction = template;

    protected _notifyProxy(e: SyntheticEvent): unknown {
        let eventName = e.type;
        const eventArgs = Array.prototype.slice.call(arguments, 1);

        if (eventName.startsWith(LIST_CONTAINER_EVENT_PREFIX)) {
            eventName = eventName.slice(LIST_CONTAINER_EVENT_PREFIX.length);
            eventName = eventName[0].toLowerCase() + eventName.slice(1);
        }
        return this._notify(eventName, eventArgs);
    }
}
