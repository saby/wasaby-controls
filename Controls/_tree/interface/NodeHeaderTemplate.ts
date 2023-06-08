/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import {
    INavigationButtonConfig,
    TNavigationButtonView,
} from 'Controls/interface';

/**
 * Шаблон шапки узлов
 * @class Controls/_tree/interface/NodeHeaderTemplate
 * @public
 */
export interface INodeHeaderTemplateOptions {
    /**
     * @name Controls/_tree/interface/NodeHeaderTemplate#navigationButtonView
     * @cfg {Controls/interface:INavigation/TNavigationButtonView.typedef} Вид кнопки подгрузки данных.
     * @default link
     * @see navigationButtonConfig
     */
    navigationButtonView?: TNavigationButtonView;
    /**
     * Настройки кнопки подгрузки данных
     * @name Controls/_tree/interface/NodeHeaderTemplate#navigationButtonConfig
     * @see navigationButtonView
     */
    navigationButtonConfig?: INavigationButtonConfig;
}
