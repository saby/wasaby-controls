/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Stack/Template/Header/Header';
import { IStackTemplateOptions } from 'Controls/_popupTemplate/Stack/Template/Stack';
import 'css!Controls/popupTemplate';

class Header extends Control<IStackTemplateOptions> {
    protected _template: TemplateFunction = template;
    /**
     * Закрыть всплывающее окно
     * @function Controls/_popupTemplate/Stack#close
     */
    changeMaximizedState(): void {
        /**
         * @event maximized
         * Occurs when you click the expand / collapse button of the panels.
         */
        this._notify('maximized', [], { bubbling: true });
    }

    protected _applyButtonClickHandler(event: Event): void {
        if (this._options.applyButtonCallback) {
            this._options.applyButtonCallback(event);
        }
    }

    protected close(): void {
        this._notify('close', [], { bubbling: true });
    }
}
export default Header;
