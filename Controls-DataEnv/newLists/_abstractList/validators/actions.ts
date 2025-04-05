import {
    IAction,
    TItemActionVisibilityCallback,
} from '../interface/IAbstractListStateParts/IActionsState';
import * as predicates from './predicates';
const { isString, isFunction, isArray, isObject } = predicates;

/**
 * Возвращает true, если itemActions подходят для работы itemActionsStateManager.
 * Так происходит только в случае, если у экшнов есть actionName, и это путь до экшна.
 * @private
 */
export function isValidActions(actions: unknown): actions is IAction[] {
    // TODO: Переделать строгую проверку every на дружелюбный filter с красной ошибкой в консоль.
    return isArray(actions) && actions.every((action) => hasInteraction(action));
}

/**
 * Возвращает признак, является ли переданное значение типом TItemActionVisibilityCallback.
 * @private
 */
export const isValidVisibilityCb = (cb: unknown): cb is TItemActionVisibilityCallback =>
    // Проверяем поверхностно, не вызывая функцию
    isFunction(cb);

/**
 * Возвращает признак, указывающий, есть ли в конфигурации действия интерактивность.
 * Позволяет отсекать действия, в которых неправильно сконфигурирована
 * интерактивность при взаимодействии с ними.
 */
function hasInteraction(action: unknown): boolean {
    if (!isObject(action)) {
        return false;
    }
    if (
        isValidName((action as IAction).actionName as unknown) ||
        isValidName((action as IAction).commandName as unknown) ||
        isValidName((action as IAction).viewCommandName as unknown)
    ) {
        return true;
    }
    const handler = (action as IAction).onExecuteHandler as unknown;
    return isFunction(handler) || isValidName(handler);
}

function isValidName(name: unknown): boolean {
    if (!name || !isString(name)) {
        return false;
    }

    return name.indexOf('/') !== -1;
}
