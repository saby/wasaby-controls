/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_propertyGrid/ReactEditorWrapper');
import { SyntheticEvent } from 'UICommon/Events';

class ReactEditorWrapper extends Control {
    protected _template: Function = template;

    protected _propertyValueChangedHandler(
        event: SyntheticEvent,
        value: any,
        fromReact: boolean
    ): void {
        if (fromReact === true) {
            // если событие от wasaby-редактора, значит оно всплывающее и нет необходимости стрелять новым событием
            event.stopImmediatePropagation();
            this._notify('propertyValueChanged', [value], { bubbling: true });
        }
    }
}

export = ReactEditorWrapper;
