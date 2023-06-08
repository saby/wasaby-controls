/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_columnScroll/DragScrollOverlay/DragScrollOverlay';
import { isFullGridSupport } from 'Controls/display';
import { JS_SELECTORS } from '../DragScrollController';

export const OVERLAY_JS_SELECTOR = JS_SELECTORS.OVERLAY;

export default class DragScrollOverlay extends Control {
    protected _template: TemplateFunction = template;
    protected readonly _classes: string = DragScrollOverlay.getClasses();

    static getClasses(): string {
        let classes = OVERLAY_JS_SELECTOR;
        if (!isFullGridSupport()) {
            classes += ` ${OVERLAY_JS_SELECTOR}_not-full-grid-support`;
        }
        return classes;
    }
}
