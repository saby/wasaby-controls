/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import template = require('wml!Controls/_form/PrimaryAction/PrimaryAction');

/**
 * Контроллер, который обрабатывает нажатие комбинации клавиш ctrl+enter (cmd+enter) и запускает событие 'triggered'.
 * @extends UI/Base:Control
 * @public
 */

export default class PrimaryAction extends Control<IControlOptions> {
    _template: TemplateFunction = template;

    protected keyDownHandler(e: SyntheticEvent<KeyboardEvent>): void {
        const enterPressed = e.nativeEvent.keyCode === constants.key.enter;
        const altOrShiftPressed =
            e.nativeEvent.altKey || e.nativeEvent.shiftKey;
        const ctrlPressed = e.nativeEvent.ctrlKey || e.nativeEvent.metaKey;
        if (!altOrShiftPressed && ctrlPressed && enterPressed) {
            // Ctrl+Enter, Cmd+Enter, Win+Enter
            // If "primary action" processed event, then event must be stopped.
            // Otherwise, parental controls (including other primary action) can react
            // to pressing ctrl+enter and call one more handler
            e.stopPropagation();
            this._notify('triggered');
        }
    }
}

/**
 * @event triggered Происходит при нажатии комбинации клавиш Ctrl + Enter и Сmd + Enter.
 * @name Controls/_form/PrimaryAction#triggered
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */
