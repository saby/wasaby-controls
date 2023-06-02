/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { TIconSize, TIconStyle } from 'Controls/interface';

/**
 * @typedef {String} Controls/_display/interface/ITree/TExpanderIconSize
 * @description Тип значений для настройки размеров иконки разворота узла
 * @variant 2xs Малые иконки разворота узла
 * @variant default Размера иконок по умолчанию
 */
export type TExpanderIconSize = Extract<TIconSize, '2xs' | 'default'>;

/**
 * @typedef {String} Controls/_display/interface/ITree/TExpanderIconStyle
 * @description Тип значений для настройки стиля цвета иконки разворота узла
 * @variant unaccented Неакцентный цвет иконки разворота узла
 * @variant default Цвет иконки разворота узла по умолчанию
 */
export type TExpanderIconStyle = Extract<TIconStyle, 'unaccented' | 'default'>;

// добавить вариант 'never', когда потребуется сделать разворот узлов без загрузки
/**
 * Режим загрузки дочерних элементов при развороте узла
 * @typedef {String} Controls/_display/interface/ITree/TChildrenLoadMode
 * @variant once Загрузка дочерних элементов происходит только при первом развороте узла
 * @variant always Загрузка дочерних элементов происходит при каждом развороте узла
 */
export type TChildrenLoadMode = 'once' | 'always';

/**
 * Режим отображения отступа вместо иконки разворота.
 * @variant visible Всегда отображает отступ, независимо от наличия иконок разворота во всем списке
 * @variant hidden Никогда не отображаем отступ
 * @variant hasExpander Отображаем отступ, если хоть у одного узла отображается экспандер
 * @default hasExpander
 */
export type TExpanderPaddingVisibility = 'visible' | 'hidden' | 'hasExpander';
