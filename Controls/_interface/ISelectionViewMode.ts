export type TSelectionViewMode = 'all' | 'selected' | 'partial' | 'hidden';

export interface ISelectionViewModeOptions {
    selectionViewMode?: TSelectionViewMode;
}
/**
 * Интерфейс для дополнительных команд в меню отметки ПМО
 * @public
 */
export default interface ISelectionViewMode {
    readonly '[Controls/_interface/ISelectionViewMode]': boolean;
}

/**
 * @typedef {String} TSelectionViewMode
 * @description Допустимые значения для опции {@link selectionViewMode}.
 * @variant all В меню отметки ПМО добавляется пункт "Отобрать отмеченные", если есть отмеченные чекбоксами записи.
 * @variant selected В меню отметки ПМО добавляется пункт "Показать все". Если есть отмеченные чекбоксами записи, так же добавляется пункт "Отобрать отмеченные"
 * @variant partial В меню отметки ПМО добавляются пункты порционной отметки (+5, +10 и т.д.)
 * @variant hidden В меню отметки не добавляет дополнительных пунктов
 */

/**
 * @name Controls/_operations/interface/ISelectionViewMode#selectionViewMode
 * @cfg {TSelectionViewMode} Определяет набор дополнительных пунктов в меню отметки ПМО.
 * @remark
 * По умолчанию в меню отметки ПМО отображается 3 пункта:
 * - Отметить всё
 * - Снять
 * - Инвертировать
 * @default hidden
 */
