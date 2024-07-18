import {IMarkSelectorOptions} from './IMarkSelectorOptions';
/**
 * Интерфейс для компонента 'Панель пометки цветом'.
 * @public
 */
export interface IMarkSelectorPanelOptions extends IMarkSelectorOptions {
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorPanelOptions#adding
     * @cfg {Boolean} Разрешено добавление - выводится (+) сверху.
     * @demo Controls-Colors-demo/Panel/Adding/Index
     * @example
     * В данном примере запретим добавление новых пометок.
     *
     * <pre class="brush: html">
     *      <Panel adding={false}
     *             ...
     *      />
     * </pre>
     * @default true
     */
    adding?: boolean;
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorPanelOptions#addedItemType
     * @cfg {String} Тип добавляемого элемента.
     * @variant color
     * @variant style
     * @default color
     * @demo Controls-Colors-demo/Panel/AddedItemType/Index
     * @example
     * В данном примере настроим панель на добавление новой стилевой пометки.
     *
     * <pre class="brush: html">
     *      <Panel addedItemType="style"
     *             ...
     *      />
     * </pre>
     */
    addedItemType?: 'color' | 'style';
}
