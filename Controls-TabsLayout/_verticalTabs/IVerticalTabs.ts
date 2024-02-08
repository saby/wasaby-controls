import { RecordSet } from 'Types/collection';
import { IControlOptions } from 'UI/Base';

/**
 * Интерфейс, описывающий опции вертикальной вкладки.
 * @public
 */
export interface IVerticalTabsItem {
    [key: string]: string;
    caption?: string;
    mainCounter?: string;
    backgroundStyle?: string;
    backgroundImage?: string;
    fontSize?: string;
    fontColorStyle?: string;
    fontWeight?: string;
    textTransform?: string;
    mainCounterFontColorStyle?: string;
}

/**
 * Интерфейс, описывающий опции контрола вертикальные вкладки.
 * @public
 */
export interface IVerticalTabs extends IControlOptions {
    keyProperty?: string;
    selectedKey?: string;
    displayProperty?: string;
    backgroundStyle?: string;
    fontSize?: string;
    fontColorStyle?: string;
    fontWeight?: string;
    textTransform?: string;
    mainCounterFontColorStyle?: string;
    items?: RecordSet<IVerticalTabsItem>;
}

/**
 * @name Controls-TabsLayout/_verticalTabs/IVerticalTabs#displayProperty
 * @cfg {String} Имя поля элемента, значение которого будет отображаться в названии вкладок.
 * @default title
 */

/**
 * @typedef {Object} Controls-TabsLayout/_verticalTabs/IVerticalTabs/Item
 * @property {String} [item.caption] Текст внутри вкладки
 * @property {String} [item.mainCounter] Текст счетчика внутри вкладки
 * @property {String} [item.backgroundStyle] Определяет префикс стиля для настройки фона вкладки.
 * @property {String} [item.fontSize] Определяет размер шрифта текста во вкладке.
 * @property {String} [item.fontColorStyle] Определяет цвет текста во вкладке.
 * @property {String} [item.fontWeight] Определяет жирность текста во вкладке.
 * @property {String} [item.textTransform] Управляет преобразованием текста вкладки в заглавые или прописные символы.
 * @property {String} [item.mainCounterFontColorStyle] Определяет цвет текста счётчика во вкладке.
 */

/**
 * @name Controls-TabsLayout/_verticalTabs/IVerticalTabs#items
 * @cfg {RecordSet.<Controls-TabsLayout/_tabs/IVerticalTabs/Item.typedef>} Рекордсет с конфигурацией вкладок.
 * @demo Controls-TabsLayout-demo/Floating/Panel
 */