import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/IntersectionObserverController/IntersectionObserverController');
import { IntersectionObserverSyntheticEntry } from 'Controls/scroll';
import { SyntheticEvent } from 'Vdom/Vdom';

export default class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _logs: string = '';

    protected _intersectHandler(
        e: SyntheticEvent,
        entries: IntersectionObserverSyntheticEntry[]
    ) {
        for (let i = 0; i < entries.length; i++) {
            this._logs += ' Обновился контент номер' + entries[i].data;
        }
    }
}
