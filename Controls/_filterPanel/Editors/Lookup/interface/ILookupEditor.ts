/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */

export interface IBaseLookupEditorOptions {
    emptyText?: string;
}

/**
 * Интерфейс редактора фильтров лукапа.
 *
 * @interface Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor
 * @implements Controls/interface:ILookup
 * @public
 */
export interface ILookupEditor {
    readonly '[Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor]': boolean;
    /**
     * @cfg {String} Текст ссылки, который отображается до первого выбора записи в контролле
     */
    emptyText?: string;
}
