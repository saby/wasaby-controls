/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
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

    protected close(): void {
        this._notify('close', [], { bubbling: true });
    }
}
export default Header;
