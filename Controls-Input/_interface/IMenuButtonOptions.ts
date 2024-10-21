import { IActionOptions } from './IActionOptions';
import { IItem } from './IItemsOptions';

export interface IMenuItem extends IItem {
    // Икона пункта меню
    icon?: string;
    // Действие, выполняемое при клике на пункт меню
    action: IActionOptions;
}
