/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { IOpener } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для опций страницы в окне.
 * @public
 * @extends Controls/_popup/interface/IPagePopupOptions
 */
export interface IPageOpener extends IOpener {
    readonly '[Controls/_popup/interface/IStackOpener]': boolean;
}

/**
 * Метод открытия страницы на всплывающем окне.
 * @function Controls/_popup/interface/IPagePopupOptions#open
 * @param {Controls/_popup/interface/IPagePopupOptions.typedef} popupOptions Конфигурация окна.
 */

/**
 * @name Controls/_popup/interface/IPagePopupOptions#mode
 * @cfg {String} Режим открытия окна, определяющий на окне какого вида будет открыта страница.
 * @variant stack Стековая панель
 * @variant sticky Прилипающее окно
 * @variant dialog Диалоговое окно
 */
