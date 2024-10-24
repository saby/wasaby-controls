/**
 * @kaizen_zone 02d84b65-7bf1-4508-9e22-9363de793974
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Dialog/Template/Header';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls/popupTemplate';

class Header extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _headingMousedownHandler(e: SyntheticEvent<MouseEvent>): void {
        // Помечаю событиие обработанным, чтобы Dialog не обрабатывал начало драга.
        // Стопать нельзя, т.к. есть необходимость у пользователя выделять заголовок.
        e.nativeEvent.processed = true;
    }

    protected _getBackgroundClass(): string {
        return this._options.headerBackgroundStyle === 'default'
            ? 'controls-DialogTemplate_backgroundStyle-default'
            : 'controls-background-' + this._options.headerBackgroundStyle;
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
