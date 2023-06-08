/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Text, generateStates } from 'Controls/input';
import { TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_lookup/BaseLookupView/InputRender/InputRender');
import 'css!Controls/lookup';

class InputRenderLookup extends Text {
    _template: TemplateFunction = template;
    _defaultInput = null;

    protected _beforeMount(options): void {
        super._beforeMount.apply(this, arguments);
        generateStates(this, options);
    }

    protected _beforeUpdate(options): void {
        super._beforeUpdate.apply(this, arguments);
        generateStates(this, options);
    }

    protected _beforeUnmount(): void {
        this._defaultInput = null;
    }

    protected _getField() {
        if (this._options.isInputVisible) {
            return super._getField.call(this);
        } else {
            // В поле связи с единичным выбором после выбора записи
            // скрывается инпут (технически он в шаблоне создаётся под if'ом),
            // но базовый input:Text ожидает, что input в вёрстке есть всегда.
            // Для корректной работы создаём виртуальный input.
            // Если его скрывать через display: none, то начинаются проблемы с фокусом,
            // поэтому данный способ нам не подходит.
            return this._getDefaultInput();
        }
    }

    protected _getReadOnlyField(): HTMLElement {
        // В поле связи с единичным выбором не строится input
        // Подробнее в комментарии в методе _getField
        if (this._options.isInputVisible) {
            return super._getReadOnlyField.call(this);
        } else {
            return this._getDefaultInput();
        }
    }

    protected _getDefaultInput() {
        if (!this._defaultInput) {
            const nativeInput: HTMLInputElement =
                document.createElement('input');
            this._defaultInput = {
                setValue: () => {
                    return undefined;
                },
                setCaretPosition: () => {
                    return undefined;
                },
                setSelectionRange: () => {
                    return undefined;
                },
                getFieldData: (name: string) => {
                    return nativeInput[name];
                },
                hasHorizontalScroll: () => {
                    return false;
                },
                paste: () => {
                    return undefined;
                },
            };
        }

        return this._defaultInput;
    }

    protected _keyDownInput(event): void {
        this._notify('keyDownInput', [event]);
    }
}

export default InputRenderLookup;
