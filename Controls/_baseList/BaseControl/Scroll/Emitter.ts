/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls/_baseList/BaseControl/Scroll/Emitter/Emitter';

export default class ScrollEmitter extends Control {
    protected _template: TemplateFunction = Template;

    startRegister(triggers: any[]): void {
        this._notify('register', ['listScroll', this, this._handleScroll, triggers], {
            bubbling: true,
        });
    }

    // TODO https://online.sbis.ru/opendoc.html?guid=5f388a43-e529-464a-8e81-3e441ebcbb83&client=3
    protected _$react_componentWillUnmount(): void {
        this._notify('unregister', ['listScroll', this], { bubbling: true });
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', ['listScroll', this], { bubbling: true });
    }

    private _handleScroll(): void {
        this._notify('emitListScroll', Array.prototype.slice.call(arguments));
    }
}
