/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
import { Formatter, IFormat } from 'Controls/baseDecorator';
import { ISplitValue } from 'Controls/_input/resources/Types';

export interface IInputConfig {
    position: number;
    value: string;
}

const _private = {
    /**
     * Получить данные путем приведения исходного значения в виде разбиения к маске.
     * @param format данные о маске.
     * @param splitValue значения в виде разбиения.
     * @return {
     *    {
     *       value: String значение с разделителями,
     *       positions: Array позиция курсора
     *    }|undefined
     * }
     */
    getDataBySplitValue(format: IFormat, splitValue: string) {
        const data = Formatter.formatData(format, {
            value: splitValue.before + splitValue.after,
            carriagePosition: splitValue.before.length,
        });
        if (data) {
            const { value, carriagePosition: position } = data;
            return { value, position };
        }
        return false;
    },
};
const InputProcessor = {
    /**
     * Получить разбиение чистого значения.
     * @param splitValue разбиение исходного значения.
     * @param clearData чистые данные.
     * @return {Object}
     */
    getClearSplitValue(splitValue: string, clearData: object): ISplitValue {
        const clearSplitValue = {};
        let start = 0;
        let position;

        clearSplitValue.before = clearData.value.substring(
            start,
            clearData.positions[splitValue.before.length]
        );
        start = clearSplitValue.before.length;
        position = splitValue.before.length;

        clearSplitValue.delete = clearData.value.substring(
            start,
            clearData.positions[position + splitValue.delete.length]
        );
        start += clearSplitValue.delete.length;
        position += splitValue.delete.length;

        clearSplitValue.after = clearData.value.substring(
            start,
            clearData.positions[position + splitValue.after.length]
        );

        clearSplitValue.insert = splitValue.insert;

        return clearSplitValue;
    },

    /**
     * Вставка.
     * @param format данные маски.
     * @param clearSplitValue разбиение чистого значения.
     * @param replacer заменитель.
     * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
     */
    insert(
        format: IFormat,
        clearSplitValue: object,
        replacer: string,
        shouldShiftReplacer: boolean = true
    ) {
        let char;
        let oldClearSplitValue;
        let newClearSplitValue;
        let data;
        let result;

        oldClearSplitValue = {
            before: clearSplitValue.before,
            after:
                clearSplitValue.delete.replace(/./g, replacer) +
                clearSplitValue.after,
        };

        // Будем добавлять по 1 символу, потому что вставка должна работать так же как и ввод по 1 символу.
        for (let i = 0; i < clearSplitValue.insert.length; i++) {
            char = clearSplitValue.insert[i];

            /*
             * Если последний символ заменитель, то попытаемся сделать сдвиг.
             */
            if (
                shouldShiftReplacer &&
                replacer === oldClearSplitValue.after.slice(-1)
            ) {
                newClearSplitValue = {
                    before: oldClearSplitValue.before + char,
                    after: oldClearSplitValue.after.slice(0, -1),
                };

                data = _private.getDataBySplitValue(format, newClearSplitValue);
            } else {
                // Добавляем символ без замены следующего.
                newClearSplitValue = {
                    before: oldClearSplitValue.before + char,
                    after: oldClearSplitValue.after,
                };

                data = _private.getDataBySplitValue(format, newClearSplitValue);

                // Если не получилось, то поробуем заменить.
                if (!data) {
                    newClearSplitValue = {
                        before: oldClearSplitValue.before + char,
                        after: oldClearSplitValue.after.substring(1),
                    };

                    data = _private.getDataBySplitValue(
                        format,
                        newClearSplitValue
                    );
                }
            }

            if (data) {
                result = data;
                data = undefined;
                oldClearSplitValue = newClearSplitValue;
            }
        }

        return result;
    },

    /**
     * Удаление.
     * @param format данные маски.
     * @param clearSplitValue разбиение чистого значения.
     * @param replacer заменитель.
     * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
     */
    delete(format: IFormat, clearSplitValue: object, replacer: string) {
        return _private.getDataBySplitValue(format, {
            before: clearSplitValue.before,
            after:
                clearSplitValue.delete.replace(/./g, replacer) +
                clearSplitValue.after,
        });
    },

    /**
     * Удаление через delete.
     * @param format данные маски.
     * @param clearSplitValue разбиение чистого значения.
     * @param replacer заменитель.
     * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
     */
    deleteForward(format: IFormat, clearSplitValue: object, replacer: string) {
        let newClearSplitValue;

        if (clearSplitValue.delete) {
            newClearSplitValue = {
                before: clearSplitValue.before + replacer,
                after: clearSplitValue.after,
            };
        } else {
            newClearSplitValue = {
                before: clearSplitValue.before + replacer,
                after: clearSplitValue.after.substring(1),
            };
        }

        return _private.getDataBySplitValue(format, newClearSplitValue);
    },

    /**
     * Удаление через backspace.
     * @param format данные маски.
     * @param clearSplitValue разбиение чистого значения.
     * @param replacer заменитель.
     * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
     */
    deleteBackward(format: IFormat, clearSplitValue: object, replacer: string) {
        let newClearSplitValue;

        if (clearSplitValue.delete) {
            newClearSplitValue = {
                before: clearSplitValue.before,
                after: replacer + clearSplitValue.after,
            };
        } else {
            newClearSplitValue = {
                before: clearSplitValue.before.slice(0, -1),
                after: replacer + clearSplitValue.after,
            };
        }

        return _private.getDataBySplitValue(format, newClearSplitValue);
    },

    _getNewSplitValue(oldSplitValue: object, value: string): object {
        // Разобьем новое отформатированное значение, before и after нового value посчитаем по кол-ву букв/цифр
        // исходного splitValue.
        const re = /[^A-Za-z0-9]+/g;
        let afterCharCount = oldSplitValue.after.replace(re, '').length;
        let beforeCharCount = oldSplitValue.before.replace(re, '').length;
        let after;
        let before;

        for (let i = value.length - 1; i >= 0; i--) {
            if (afterCharCount === 0) {
                after = value.substring(i + 1, value.length);
                break;
            }
            if (/^[0-9A-Za-z]$/g.test(value[i])) {
                afterCharCount--;
            }
        }

        for (let j = 0; j <= value.length; j++) {
            if (beforeCharCount === 0) {
                before = value.substring(0, j);
                break;
            }
            if (/^[0-9A-Za-z]$/g.test(value[j])) {
                beforeCharCount--;
            }
        }

        return {
            before,
            after,
            insert: oldSplitValue.insert,
            delete: oldSplitValue.delete,
        };
    },

    _getDataByCurDisplayValue(
        oldValue: string,
        oldSplitValue: object,
        oldFormat: object,
        curDisplayValue: string
    ): object {
        let newSplit;
        if (curDisplayValue) {
            const isMatch = oldValue.match(oldFormat.searchingGroups);
            if (!isMatch) {
                curDisplayValue = curDisplayValue.replace(/[^A-Za-z0-9]+/g, '');
                const formatData = Formatter.formatData(oldFormat, {
                    value: curDisplayValue,
                    carriagePosition: 0,
                });
                if (formatData) {
                    newSplit = this._getNewSplitValue(
                        oldSplitValue,
                        formatData.value
                    );
                    return {
                        splitValue: newSplit,
                        value: formatData.value,
                    };
                }
            }
        }
    },

    /**
     * Ввод.
     * @param splitValue значение разбитое на части before, insert, after, delete.
     * @param inputType тип ввода.
     * @param replacer заменитель.
     * @param oldFormat данные маски, на которую проецировалось разбитое значение.
     * @param newFormat данные маски, на которую будет проецироваться разбитое значение.
     * @return {{value: (String) новая строка, position: (Integer) позиция курсора}}
     */
    input(
        splitValueSrc: object,
        inputType: string,
        replacer: string,
        oldFormat: object,
        newFormat: object,
        curDisplayValue: string,
        shouldShiftReplacer: boolean
    ): IInputConfig {
        const splitValue = { ...splitValueSrc };
        let value = splitValue.before + splitValue.delete + splitValue.after;

        const dataCurDisplayValue = this._getDataByCurDisplayValue(
            value,
            splitValue,
            oldFormat,
            curDisplayValue
        );
        if (dataCurDisplayValue) {
            splitValue.before = dataCurDisplayValue.splitValue.before;
            splitValue.after = dataCurDisplayValue.splitValue.after;
            value = dataCurDisplayValue.value;
        }

        let clearData = Formatter.clearData(oldFormat, value);
        if (!clearData) {
            clearData = Formatter.clearData(oldFormat, curDisplayValue);
            if (!clearData) {
                return;
            }
        }

        const clearSplitValue = dataCurDisplayValue
            ? dataCurDisplayValue.splitValue
            : InputProcessor.getClearSplitValue(splitValue, clearData);

        let result;
        switch (inputType) {
            case 'insert':
                result = InputProcessor.insert(
                    newFormat,
                    clearSplitValue,
                    replacer,
                    shouldShiftReplacer
                );
                break;
            case 'delete':
                result = InputProcessor.delete(
                    newFormat,
                    clearSplitValue,
                    replacer
                );
                break;
            case 'deleteForward':
                result = InputProcessor.deleteForward(
                    newFormat,
                    clearSplitValue,
                    replacer
                );
                break;
            case 'deleteBackward':
                result = InputProcessor.deleteBackward(
                    newFormat,
                    clearSplitValue,
                    replacer
                );
                break;
        }

        // Result is undefined when input was invalid
        if (result) {
            result.format = newFormat;
        } else {
            // Return old value
            result = {
                value,
                position: splitValue.before.length + splitValue.delete.length,
                format: oldFormat,
            };
        }

        return result;
    },
};

InputProcessor._private = _private;

export = InputProcessor;
