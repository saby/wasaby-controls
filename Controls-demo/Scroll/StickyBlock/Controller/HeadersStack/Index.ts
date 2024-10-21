import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlock/Controller/HeadersStack/Template');

export default class HeadersStack1 extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isHeaderVisible1: boolean = true;
    protected _isHeaderVisible2: boolean = false;

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._children.container.scrollToBottom();
    }

    protected _onClick1(): void {
        this._isHeaderVisible1 = !this._isHeaderVisible1;
    }

    protected _onClick2(): void {
        this._isHeaderVisible2 = !this._isHeaderVisible2;
    }
}
