/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
/**
 * Интерфейс для выпадающих списков, поддерживающих ленивую загрузку данных.
 *
 * @interface Controls/dropdown:IUnderline
 * @public
 */

export interface IUnderlineOptions {
    /**
     * @name Controls/dropdown:IUnderline#underline
     * @cfg {String} Стиль декоративной линии.
     * @variant fixed всегда будет подчеркивание
     * @variant none никогда не будет подчеркивания
     * @variant hovered подчеркивание только по наведению
     * @default hovered
     * @demo Controls-demo/dropdown_new/Input/Underline/Index
     */
    underline?: string;
}
