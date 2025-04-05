import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Sticky/StickyTemplate';
import { StickyOpener } from 'Controls/popup';

export default class StickyTemplate extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    private _sticky: StickyOpener = new StickyOpener({
        actionOnScroll: 'track',
        fittingMode: 'overflow',
        targetPoint: {
            horizontal: 'right',
            vertical: 'top',
        },
        direction: {
            vertical: 'top',
        },
    });

    protected _openSticky(): void {
        this._sticky.open({
            template: 'Controls-demo/Popup/Sticky/StickyTemplate',
            opener: this,
            target: this._children.stickyButton as Control,
        });
    }
}
