import { IPropertyGridOptions } from 'Controls/_propertyGrid/IPropertyGrid';

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/property-grid/ редактора свойств} с возможностью группировки по вкладкам.
 * @public
 */
export default interface IPropertyGridTabbedViewOptions extends IPropertyGridOptions {
    /**
     * @name Controls/_PropertyGridTabbedView/interface/IPropertyGridTabbedView#tabProperty
     * @cfg {string} Имя свойства, содержащего идентификатор таба элемента редактора свойств.
     * @demo Controls-demo/PropertyGridNew/TabbedView/Index
     */
    tabProperty: string;
}
