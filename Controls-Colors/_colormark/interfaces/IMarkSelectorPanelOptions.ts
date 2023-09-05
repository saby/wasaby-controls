import {IMarkSelectorOptions} from './IMarkSelectorOptions';
/**
 * Интерфейс для компонента 'Панель пометки цветом'.
 * @public
 */
export interface IMarkSelectorPanelOptions extends IMarkSelectorOptions {
    /**
     * @name Controls-Colors/_colormark/interface/IMarkSelectorPanelOptions#adding
     * @cfg {Boolean} Разрешено добавление - выводится (+) сверху.
     * @default true
     */
    adding?: boolean;
}
