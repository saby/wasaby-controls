/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { INavigationButtonConfig, TNavigationButtonView } from 'Controls/interface';

/**
 * Шаблон подвала узлов
 * @class Controls/_tree/interface/NodeFooterTemplate
 * @public
 */
export interface INodeFooterTemplateOptions {
    /**
     * @name Controls/_tree/interface/NodeFooterTemplate#content
     * @cfg {String|TemplateFunction} Пользовательский шаблон подвала узла.
     */
    content?: TemplateFunction;
    /**
     * @name Controls/_tree/interface/NodeFooterTemplate#navigationButtonView
     * @cfg {Controls/interface:INavigation/TNavigationButtonView.typedef} Вид кнопки подгрузки данных.
     * @default link
     * @see navigationButtonConfig
     */
    navigationButtonView?: TNavigationButtonView;
    /**
     * Настройки кнопки подгрузки данных
     * @name Controls/_tree/interface/NodeFooterTemplate#navigationButtonConfig
     * @see navigationButtonView
     */
    navigationButtonConfig?: INavigationButtonConfig;
}
