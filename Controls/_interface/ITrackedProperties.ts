/**
 * @kaizen_zone 2de0f49e-7ae0-440c-b3ed-50aebacad48e
 */
import type { ReactElement } from 'react';
import type { TemplateFunction } from 'UI/base';

/**
 * @typedef {string} Controls/_interface/ITrackedProperties#TDisplayType
 * @description Тип отображаемого значения для применения соответствующего декоратора.
 * @variant string строка
 * @variant date дата
 * @variant number число
 * @variant money деньги
 */
export type TDisplayType = 'money' | 'date' | 'number' | 'string';

/**
 * @typedef {Object} Controls/_interface/ITrackedProperties#ITrackedPropertiesItem
 * @description Конфигурация отслеживаемого свойства.
 * @property {string} propertyName Имя отслеживаемого свойства
 * @property {Controls/_interface/ITrackedProperties#TDisplayType} displayType Тип отображения
 * @property {TemplateFunction | string | ReactElement} template
 * @property {Object} templateOptions
 */
export interface ITrackedPropertiesItem {
    propertyName: string;
    displayType?: string;
    templateOptions?: { [key: string]: unknown };
    template?: TemplateFunction | string | ReactElement;
}

/**
 * Интерфейс для контролов с возможностью отображения отслеживаемых полей записей.
 * @public
 */
export interface ITrackedProperties {
    /**
     * Имена полей записи, значения которых будут отслеживаться при скролле.
     * @cfg
     * @demo Controls-demo/list_new/TrackedProperties/Index
     * @description  Механизм отслеживания вычисляет, какая запись расположена на границе скролла. Значения отслеживаемых полей данной записи передаются в шаблон, который закрепляется механизмом sticky в верхней части списка.
     * @remark Стандартный шаблон выводит значения отслеживаемых полей в едином стиле. Для настройки пользовательского отображения значений необходимо задавать пользовательский шаблон в опции {@link Controls/_interface/ITrackedProperties#trackedPropertiesTemplate} .
     * @see Controls/_interface/ITrackedProperties#trackedPropertiesTemplate
     */
    trackedProperties?: ITrackedPropertiesItem[];

    /**
     * Пользовательский шаблон отображения значений полей записи, отслеживаемых при скролле.
     * @cfg
     * @demo Controls-demo/list_new/TrackedProperties/TrackedPropertiesTemplate/Index
     * @description В области видимости шаблона доступно свойство trackedValues {IHashMap}. Оно представляет собой словарь, содержащий значения отслеживаемых полей
     * @example
     * WML:
     * <pre class="brush: html; highlight: [7,8,9,10,11]">
     * <Controls.scroll:Container attr:style="max-height: 200px">
     *      <Controls.list:View
     *          keyProperty="key"
     *          source="{{_viewSource}}"
     *          trackedProperties="{{_trackedProperties}}">
     *          <ws:trackedPropertiesTemplate>
     *              <Controls.list:TrackedPropertiesTemplate position="right">
     *                  <div>Значение отслеживаемого свойства {{trackedPropertiesTemplate.trackedValues.trackedVal}}</div>
     *              </Controls.list:TrackedPropertiesTemplate>
     *          </ws:trackedPropertiesTemplate>
     *      </Controls.list:View>
     * </Controls.scroll:Container>
     * </pre>
     *
     * @see Controls/_interface/ITrackedProperties#trackedProperties
     * @see Controls/_list/TrackedPropertiesTemplate
     */
    trackedPropertiesTemplate?: TemplateFunction | string | ReactElement;
}
