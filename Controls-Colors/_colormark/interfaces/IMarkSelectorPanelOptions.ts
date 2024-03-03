import {IMarkSelectorOptions} from './IMarkSelectorOptions';
/**
 * Интерфейс для компонента 'Панель пометки цветом'.
 * @public
 */
export interface IMarkSelectorPanelOptions extends IMarkSelectorOptions {
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorPanelOptions#adding
     * @cfg {Boolean} Разрешено добавление - выводится (+) сверху.
     * @default true
     */
    adding?: boolean;
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorPanelOptions#addedItemType
     * @cfg {String} Тип добавляемого элемента.
     * @variant color
     * @variant style
     * @default color
     */
    addedItemType?: 'color' | 'style';
}
