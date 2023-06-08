/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Интерфейс для списочных контролов с возможностью настройки отображения элементов.
 * @interface Controls/_interface/IItemTemplate
 * @private
 */
export interface IItemTemplateOptions {
    /**
     * @name Controls/_interface/IItemTemplate#itemTemplateProperty
     * @cfg {String} Имя свойства, содержащего ссылку на шаблон элемента. Если значение свойства не передано, то для отрисовки используется itemTemplate.
     */
    itemTemplateProperty?: string;
    /**
     * @name Controls/_interface/IItemTemplate#itemTemplate
     * @cfg {TemplateFunction|String} Шаблон элемента списка.
     * @remark
     * По умолчанию используется шаблон "Controls/list:ItemTemplate".
     *
     * Базовый шаблон itemTemplate поддерживает следующие параметры:
     * - contentTemplate {Function} — Шаблон содержимого элемента;
     * - highlightOnHover {Boolean} — Выделять элемент при наведении на него курсора мыши.
     * - cursor {TCursor} — Устанавливает вид {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора мыши} при наведении на строку.
     *
     * В области видимости шаблона доступен объект item, позволяющий получить доступ к данным рендеринга (например, элемент, ключ и т.д.).
     *
     * Подробнее о работе с шаблоном читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/list/item/">руководстве разработчика</a>.
     * @remark
     * Чтобы отобразить чекбоксы в режиме "только для чтения" воспользуйтесь опцией списка {@link Controls/_list/interface/IList#multiSelectAccessibilityProperty multiSelectAccessibilityProperty}
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.list:View>
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
     *          <ws:contentTemplate>
     *             <span>{{contentTemplate.item.contents.description}}</span>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     * @see @see Controls/_list/interface/IList#multiSelectAccessibilityProperty
     */
    itemTemplate?: TemplateFunction | string;

    /**
     * @cfg Объект с опциями для шаблона элемента списка.
     * @remark
     * Позволяет передать дополнительные настройки в шаблон элемента списка, которые будут доступны в области видимости шаблона.
     * Необходимо использовать для кастомизации шаблона элемента списка, в случаях когда нужно избежать дублирования кода.
     */
    itemTemplateOptions?: { [key: string]: unknown };
}

interface IItemTemplate {
    readonly '[Controls/_interface/IItemTemplate]': boolean;
}

export default IItemTemplate;
