/**
 * Тип привязки к объекту в контексте
 */
export type BindingPathItem = string;
export type NameBindingType = BindingPathItem[];

/**
 * Интерфейс для виджетов, с возможностью прямой работы с контекстом данных.
 * @interface Controls/_interface/ITrackedProperties
 * @public
 */
export interface IConnectedWidgetProps {
    name: NameBindingType;
    value: null;
    onChange: null;
}
