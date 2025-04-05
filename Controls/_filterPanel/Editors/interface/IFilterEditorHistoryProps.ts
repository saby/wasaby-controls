/**
 * @interface Controls/filterPanel:IFilterEditorHistoryProps
 * @public
 */
export interface IFilterEditorHistoryProps {
    /**
     * @name Controls/filterPanel:IFilterEditorHistoryProps#historySaveCallback
     * @cfg {Function|String} Функция обратного вызова после сохранения записи в историю.
     */
    historySaveCallback?: (() => void) | string;
}
