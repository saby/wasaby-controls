/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { INavigationButtonConfig, TNavigationButtonView } from 'Controls/interface';

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
