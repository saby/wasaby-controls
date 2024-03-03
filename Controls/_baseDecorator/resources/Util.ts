/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IWasabyAttributes } from 'UICore/Executor';

export interface IText {
    /**
     * Значение текста.
     */
    value: string;
    /**
     * Позиция каретки.
     */
    carriagePosition: number;
}

export function paste(original: string, value: string, position: number = original.length): string {
    const validPosition = Math.max(0, position);

    return original.slice(0, validPosition) + value + original.slice(validPosition);
}

export function replace(original: string, value: string, position: number = 0): string {
    const validPosition = Math.max(0, position);

    return original.slice(0, validPosition) + value + original.slice(validPosition + value.length);
}

export function remove(original: string, start: number, end: number = original.length): string {
    return original.substring(0, start) + original.substring(end);
}

/**
 * Вставляет значение в текст. Позиция каретки смещается так, чтобы предыдущий символ не изменился.
 */
export function pasteWithRepositioning(original: IText, value: string, position: number): IText {
    original.value = paste(original.value, value, position);

    if (original.carriagePosition >= position) {
        original.carriagePosition += value.length;
    }

    return original;
}

/**
 * Меняет значение после каретки. Длина заменяемого значения равна длине вставляемого. Позиция каретки смещается так,
 * чтобы предыдущий символ не изменился.
 */
export function replaceWithRepositioning(original: IText, value: string, position: number): IText {
    original.value = replace(original.value, value, position);

    if (original.carriagePosition >= position) {
        original.carriagePosition += value.length;
    }

    return original;
}

/**
 * Удаляет значение из текста. Позиция каретки смещается так, чтобы предыдущий и неудаленный символ не изменяется.
 */
export function removeWithRepositioning(original: IText, start: number, end: number): IText {
    original.value = remove(original.value, start, end);

    if (original.carriagePosition < start) {
        return original;
    } else if (start <= original.carriagePosition && original.carriagePosition <= end) {
        original.carriagePosition = start;
    } else {
        original.carriagePosition -= end - start;
    }

    return original;
}

export function getAttrs(
    attrs: IWasabyAttributes,
    className: string,
    mainClass: string = ''
): object {
    const result = {...wasabyAttrsToReactDom(attrs)};
    if (result.className) {
        result.className += ' ' + mainClass;
    } else {
        result.className = mainClass;
    }
    if (className) {
        result.className += ' ' + className;
    }
    return result;
}
