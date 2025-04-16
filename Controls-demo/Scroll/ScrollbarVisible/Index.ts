import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Scroll/ScrollbarVisible/Template';
import { setSettings } from 'Controls/Application/SettingsController';

export default class ScrollbarVisibleDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _beforeMount(): void {
        setSettings({ scrollContainerWheelEventHappenedDemo: false });
    }

    static _styles: string[] = ['Controls-demo/Scroll/ScrollbarVisible/Style'];
}
