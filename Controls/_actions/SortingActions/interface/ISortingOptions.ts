import { IActionOptions } from 'Controls/_actions/interface/IActionOptions';
import { TSortingValue } from 'Controls/interface';

/**
 * @interface Controls/_actions/SortingActions/interface/ISortingItem
 * @public
 */
export interface ISortingItem {
    /**
     * Ключ элемента
     */
    id?: string;
    /**
     * Название элемента.
     */
    title: string;
    /**
     * Значение сортировки
     */
    value?: TSortingValue | null;
    /**
     * Иконка
     */
    icon: string;
    /**
     * Название парметра сортировки
     */
    paramName: string;
    /**
     * Тултип элемента при сортировке по убыванию
     */
    titleDesc?: string;
    /**
     * Тултип элемента при сортировке по возрастанию
     */
    titleAsc?: string;
}

/**
 * @interface Controls/_actions/SortingActions/interface/ISortActionOptions
 * @public
 * @extends Controls/_actions/interface/IActionOptions
 */
export interface ISortActionOptions extends IActionOptions {
    items: ISortingItem[];
    headingCaption?: string;
}
/**
 * @name Controls/_actions/SortingActions/interface/ISortActionOptions#headingCaption
 * @cfg {string} Заголовок меню сортировки.
 */

/**
 * @name Controls/_actions/SortingActions/interface/ISortActionOptions#items
 * @cfg {Array<ISortingItem>} Заголовок меню сортировки.
 */
