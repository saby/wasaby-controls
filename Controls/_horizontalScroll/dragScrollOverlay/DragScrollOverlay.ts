/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_horizontalScroll/dragScrollOverlay/DragScrollOverlay';
import { isFullGridSupport } from 'Controls/display';

export const OVERLAY_JS_SELECTOR = 'controls-DragScroll__overlay';

export default class DragScrollOverlay extends Control {
    protected _template: TemplateFunction = template;
    private readonly _classes: string = DragScrollOverlay.getClasses();
    private _isShown: boolean = false;

    protected _afterMount(): void {
        this._notify('ready', [this]);
    }

    show(): void {
        if (!this._isShown) {
            this._isShown = true;
        }
    }

    hide(): void {
        if (this._isShown) {
            this._isShown = false;
        }
    }

    static getClasses(): string {
        let classes = OVERLAY_JS_SELECTOR;
        if (!isFullGridSupport()) {
            classes += ` ${OVERLAY_JS_SELECTOR}_not-full-grid-support`;
        }
        return classes;
    }
}
