/**
 * @kaizen_zone d7dff399-200f-4169-9c69-4c54617de7e8
 */

import { Control, TemplateFunction } from 'UI/Base';
import componentTmpl = require('wml!Controls/_shortDatePicker/List');

class View extends Control {
    protected _template: TemplateFunction = componentTmpl;

    protected _proxyEvent(event: Event): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    protected _itemClickHandler(event: Event, value: Date, mouseEvent: Event): void {
        if (mouseEvent) {
            this._children.dragNDrop.startDragNDrop({allowAutoscroll: true}, mouseEvent);
        }
        this._proxyEvent(...arguments);
    }
}

export default View;
