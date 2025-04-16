import type { IActionWithCommand, IActionWithoutCommand } from 'Controls/actions';

/**
 * Тип опции записи в списке.
 * @public
 */
export interface IAction extends IActionWithCommand, IActionWithoutCommand {}
