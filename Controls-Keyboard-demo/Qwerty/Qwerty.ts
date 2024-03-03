import { Control, TemplateFunction } from 'UI/Base';
import { default as Qwerty, IQwertyOptions } from 'Controls-Keyboard/Qwerty';
import * as template from 'wml!Controls-Keyboard-demo/Qwerty/Qwerty';
import { Enum } from 'Types/collection';

export default class DemoQwerty extends Control<IQwertyOptions> {
    protected _template: TemplateFunction = template;

    protected _textOfButton: string;

    protected _keyboardIsOpen: boolean = false;

    protected _selectedKey: 's' | 'l' = 's';

    protected _pressedButton: string;

    protected _enumInst: Enum<string> = new Enum({
        dictionary: ['s', 'l'],
        index: 1,
    });

    protected _toggleKeyboard(): void {
        if (this._keyboardIsOpen) {
            Qwerty.close();
            this._textOfButton = 'Открыть клавиатуру';
            this._pressedButton = '';
        } else {
            Qwerty.open({
                opener: this,
                templateOptions: {
                    itemPressCallback: this._qwertyCallback,
                    size: this._selectedKey,
                    accentButtonCaption: 'Найти',
                },
            });
            this._textOfButton = 'Закрыть клавиатуру';
        }

        this._keyboardIsOpen = !this._keyboardIsOpen;
    }

    private _qwertyCallback(button: string): void {
        if (button === ' ') {
            this._pressedButton = 'space';
            return;
        }

        this._pressedButton = button;
    }

    protected _beforeMount(): void {
        this._textOfButton = 'Открыть клавиатуру';
        this._qwertyCallback = this._qwertyCallback.bind(this);
    }

    protected _beforeUnmount(): void {
        this._qwertyCallback = null;
    }

    static _styles: string[] = ['Controls-Keyboard-demo/Qwerty/Qwerty'];
}
