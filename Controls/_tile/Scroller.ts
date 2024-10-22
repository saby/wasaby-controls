/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { TemplateFunction, Control } from 'UI/Base';
import { getScrollLeftToEdgeElement } from 'Controls/baseTile';
import template = require('wml!Controls/_tile/render/Scroller');
import { _IListScrollContextOptions as IListScrollContextOptions } from 'Controls/scroll';

export default class Scroller extends Control {
    protected _template: TemplateFunction = template;
    protected _getListScrollContextValueCallback: Function;

    protected _arrowButtonClickCallback(direction: 'prev' | 'next'): boolean {
        const scrollLeft = getScrollLeftToEdgeElement(
            this._container,
            direction === 'prev' ? 'backward' : 'forward'
        );
        if (scrollLeft !== null) {
            this._notify('doHorizontalScroll', [scrollLeft], {
                bubbling: true,
            });
            return false;
        }
    }
    protected _beforeMount(): void {
        this._getListScrollContextValueCallback = this._getListScrollContextValue.bind(this);
    }

    private _getListScrollContextValue(context: IListScrollContextOptions): void {
        if (context?.setArrowButtonClickCallback) {
            context.setArrowButtonClickCallback(this._arrowButtonClickCallback.bind(this));
        }
    }
}
