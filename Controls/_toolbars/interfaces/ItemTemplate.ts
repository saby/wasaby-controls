/**
 * @kaizen_zone 5c260dca-bc4a-4366-949a-824d00984a8e
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Шаблон, который используется для отображения элементов {@link Controls/toolbars:View тулбара}.
 * @class Controls/toolbars:ItemTemplate
 * @public
 * @see Controls/toolbars:View
 * @see Controls/toolbars
 *
 * @example
 * В следующем примере показано, как использовать шаблон.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.toolbars:View
 *    items="{{_toolbarItems}}"
 *    keyProperty="id">
 *       <ws:itemTemplate>
 *          <div class="controls-background-unaccented-same">
 *              <ws:partial template="Controls/toolbars:ItemTemplate"
 *                          item="{{itemTemplate.item}}"
 *                          buttonTemplate="{{itemTemplate.buttonTemplate}}"/>
 *          </div>
 *       </ws:itemTemplate>
 * </Controls.toolbars:View>
 * </pre>
 *
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/toolbar/#template-standart руководство разработчика}
 */

export default interface IItemTemplateOptions {
    /**
     * @name Controls/toolbars:ItemTemplate#theme
     * @cfg {String} Название темы оформления. В зависимости от темы загружаются различные таблицы стилей и применяются различные стили к контролу.
     */
    theme?: string;
    /**
     * @name Controls/toolbars:ItemTemplate#item
     * @cfg {Controls/_toolbars/IToolbarSource/Item.typedef} Запись, переданная в опции items или source тулбара.
     */
    item?: object;
    /**
     * @name Controls/toolbars:ItemTemplate#buttonTemplate
     * @cfg {String|TemplateFunction} Шаблон кнопки тулбара.
     */
    buttonTemplate?: string | TemplateFunction;
    /**
     * @name Controls/toolbars:ItemTemplate#buttonTemplateOptions
     * @cfg {Object} Опции для шаблона, переданного в {@link buttonTemplate}
     */
    buttonTemplateOptions?: object;
}
