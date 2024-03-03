/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
import { FormatBuilder, Formatter } from 'Controls/baseDecorator';
import InputProcessor = require('Controls/_input/Mask/InputProcessor');
import { ViewModel as BaseViewModel } from 'Controls/_input/Base/ViewModel';
import isMaskFormatValid from 'Controls/_input/Mask/isFormatValid';
import { IInputConfig } from 'Controls/_input/Mask/InputProcessor';
import { Logger } from 'UI/Utils';

const CORRECT_MASK_LENGTH = 19;

/**
 * @class Controls/_input/Text/ViewModel
 * @private
 */
const _private = {
    updateFormatMaskChars(self: ViewModel, formatMaskChars: object) {
        if (self._formatMaskChars === formatMaskChars) {
            return;
        }
        self._formatMaskChars = formatMaskChars;
        if (JSON.stringify(self._formatMaskChars) !== JSON.stringify(formatMaskChars)) {
            self._nextVersion();
        }
        self.formatMaskCharsRegExp = new RegExp(
            '[' + Object.keys(formatMaskChars).join('') + ']',
            'g'
        );
    },

    prepareSplitValue(result: object) {
        const position = result?.position;
        const before = result?.value?.substring(0, position) || '';
        const after = result?.value?.substring(position, result?.value?.length) || '';

        return {
            before,
            after,
            insert: '',
            delete: '',
        };
    },
};

class ViewModel extends BaseViewModel {
    protected _shouldShiftReplacer: boolean = true;
    constructor(...args: any[]) {
        super(...args);
        this.setCarriageDefaultPosition(args[0].selectionStart || 0);
    }

    checkMaskValue(moduleName: string): void {
        if (this.options.mask?.length > CORRECT_MASK_LENGTH && this.options.replacer) {
            const warnMessage = `${moduleName}: В контрол передана слишком длинная маска (больше ${CORRECT_MASK_LENGTH} символов).
                 Если в replacer передано значение не входящее в formatMaskChars, то оно будет проигнорировано.`;
            Logger.warn(`${warnMessage}`, this);
        }
    }

    _convertToValue(displayValue: string): string {
        let value;
        if (Array.isArray(this.options.mask)) {
            this.options.mask.some((mask) => {
                value = this._getValue(displayValue, mask);
                return !!value;
            });
        } else {
            value = this._getValue(displayValue, this.options.mask);
        }

        return value || '';
    }

    protected _setFormat(mask: string): void {
        let replacer = this.options.replacer;
        if (replacer) {
            replacer = mask.length > CORRECT_MASK_LENGTH ? ' ' : replacer;
        }
        this._format = FormatBuilder.getFormat(mask, this.options.formatMaskChars, replacer);
    }

    _getValue(displayValue: string, mask: string): string {
        this._setFormat(mask);
        const value = Formatter.clearData(this._format, displayValue)?.value || '';
        return value;
    }

    _convertToDisplayValue(value: string): string {
        const mask = this._getMask(value);
        this._setFormat(mask);
        const fValue = value === null ? '' : value;
        _private.updateFormatMaskChars(this, this.options.formatMaskChars);
        const fData = Formatter.formatData(this._format, {
            value: fValue,
            carriagePosition: 0,
        });
        if (fData) {
            if (this._displayValue !== fData.value) {
                this._nextVersion();
            }
            return fData.value;
        } else {
            if (this.options.replacer) {
                const res = mask.replace(this.formatMaskCharsRegExp, this.options.replacer);
                if (this._displayValue !== res) {
                    this._nextVersion();
                }
                return res;
            }
            return '';
        }
    }

    private _getMask(value: string): string {
        if (!value) {
            let resMask = this._options.mask;
            if (Array.isArray(this._options.mask)) {
                resMask = this._options.mask[0];
            }
            return resMask;
        }

        const curValue = value.replace(/[^A-Za-zа-яА-Я0-9ёЁ]+/g, '');
        let mask;
        if (Array.isArray(this._options.mask)) {
            this._options.mask.some((curMask) => {
                const maskValid = isMaskFormatValid(curValue, curMask);
                if (maskValid) {
                    mask = curMask;
                }
                return maskValid;
            });
            mask = mask || this._options.mask[0];
        } else {
            mask = this._options.mask;
        }
        return mask;
    }

    private _getFormattedValue(): string {
        const mask = this._getMask(this.newValue);
        const re = /[^A-Za-zа-яА-Я0-9ёЁ]+/g;

        const value = this.newValue.replace(re, '');
        const format = FormatBuilder.getFormat(
            mask,
            this.options.formatMaskChars,
            this.options.replacer
        );
        const formatData = Formatter.formatData(format, {
            value,
            carriagePosition: 0,
        });
        return formatData?.value;
    }

    handleInput(splitValue: object, inputType: string): boolean {
        const results = [];
        let result;
        let formattedValue;
        if (Array.isArray(this.options.mask)) {
            formattedValue = this._getFormattedValue();
            this.options.mask.forEach((curMask) => {
                result = this._getInputProcessorResult(splitValue, inputType, curMask);
                results.push(result);
            });
        } else {
            result = this._getInputProcessorResult(splitValue, inputType, this.options.mask);
            results.push(result);
        }

        const matchResult = this._getBestMatchResult(results, formattedValue);
        return super.handleInput.call(this, _private.prepareSplitValue(matchResult));
    }

    private _getBestMatchResult(results: object[], resValue: string): object {
        const index = results
            .map((res) => {
                if (res) {
                    return res.value;
                }
            })
            .indexOf(resValue);

        // Если ничего не нашли, то будем считать по кол-ву символов (буквам, цифрам). Не найтись маска может,
        // в таком случае: L 123 [тут каретка]2, нажали backspace, то удалится только пробел, а нужно
        // будет удалить 3.
        // Почему не подходит подсчет только по кол-ву символов: Задано значение L 123, выделяем цифры и
        // пишем букву s. В masks задано ['L ddd', 'xxxxxx']. Ожидаем получить значение Ls, но значением не
        // поменяется т.к по первой маске введенный символ не пройдет, символов будет больше и выберется L ddd маска
        if (index === -1 || resValue === undefined) {
            const valuesLength = [];
            results.forEach((res) => {
                if (res) {
                    valuesLength.push(res.value.replace(/[^A-Za-z0-9]+/g, '').length);
                }
            });
            const maxValueLength = Math.max(...valuesLength);
            return results[
                results.findIndex((res) => {
                    if (res) {
                        return res.value.replace(/[^A-Za-z0-9]+/g, '').length === maxValueLength;
                    } else {
                        return;
                    }
                })
            ];
        } else {
            return results[index];
        }
    }

    private _getInputProcessorResult(
        splitValue: object,
        inputType: string,
        mask: string
    ): IInputConfig {
        this._setFormat(mask);
        this._nextVersion();
        _private.updateFormatMaskChars(this, this.options.formatMaskChars);
        const result = InputProcessor.input(
            splitValue,
            inputType,
            this.options.replacer,
            this._format,
            this._format,
            this.newValue,
            this._shouldShiftReplacer
        );
        return result;
    }

    setCarriageDefaultPosition(currentPosition?: number) {
        const selection = this._getCarriageDefaultPosition(currentPosition);
        if (selection !== currentPosition || selection !== this.selection.start) {
            this.selection = selection;
            this._nextVersion();
            this._shouldBeChanged = true;
        }
    }

    private _getCarriageDefaultPosition(currentPosition?: number): number {
        let position;
        let isFiled;

        if (this.options.replacer) {
            position = this.displayValue.indexOf(this.options.replacer);
            isFiled = position === -1;
            if (currentPosition === undefined) {
                currentPosition = isFiled ? 0 : position;
            }
            return isFiled ? currentPosition : Math.min(currentPosition, position);
        }
        return currentPosition === undefined ? this.displayValue.length : currentPosition;
    }
}

export = ViewModel;
