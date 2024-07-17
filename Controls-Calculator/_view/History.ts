import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Calculator/_view/History/History';
import * as rk from 'i18n!Controls-Calculator';
import 'css!Controls-Calculator/View';

/**
 * Контрол для отображения истории ввода в калькулятор
 * @private
 */
export default class History extends Control<IControlOptions> {
    readonly _template: TemplateFunction = template;
    protected _rk: rk = rk;

    protected _afterMount(): void {
        this.scrollToBottom();
    }

    protected _afterRender(): void {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        // @ts-ignore
        this._children.historyScrollContainer.scrollToBottom();
    }
}
