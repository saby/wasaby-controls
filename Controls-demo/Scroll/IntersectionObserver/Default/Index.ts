import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import controlTemplate = require('wml!Controls-demo/Scroll/IntersectionObserver/Default/Template');
import { IntersectionObserverSyntheticEntry } from 'Controls/scroll';

export default class IntersectionObserverDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _logs: string[] = [];

    protected _intersectHandler(e: SyntheticEvent, entryData: IntersectionObserverSyntheticEntry) {
        this._logs.push(
            `Обновилась видимость блока ${entryData.data}. Видно ${
                entryData.nativeEntry.intersectionRatio * 100
            }%`
        );
    }
}
