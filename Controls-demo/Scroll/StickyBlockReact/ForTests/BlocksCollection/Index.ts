import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/ForTests/BlocksCollection/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class BlocksCollection extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isHeaderVisible1: boolean = true;
    protected _isHeaderVisible2: boolean = false;
    protected _isHeaderVisible4: boolean = true;
    protected _isHeaderVisible5: boolean = false;

    protected _afterMount(): void {
        this._children.container.scrollToBottom();
        this._children.container2.scrollToBottom();
    }

    protected _onClick1(): void {
        this._isHeaderVisible1 = !this._isHeaderVisible1;
    }

    protected _onClick2(): void {
        this._isHeaderVisible2 = !this._isHeaderVisible2;
    }

    protected _onClick3(): void {
        this._isHeaderVisible4 = !this._isHeaderVisible4;
    }

    protected _onClick4(): void {
        this._isHeaderVisible5 = !this._isHeaderVisible5;
    }
}
