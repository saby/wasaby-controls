/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IStoreIdOptions {
    storeId?: string;
}
/**
 * Интерфейс для контролов, поддерживающих связь через контекст по идентификатору загрузчика (storeId)
 * @public
 */

export default interface IStoreId {
    readonly '[Controls/_interface/IStoreId]': boolean;
}

/**
 * @name Controls/_interface/IStoreId#storeId
 * @cfg {String} Индентификатор загрузчика данных.
 * @example
 * В этом примере демонстрируется конфигурация загрузчика данных (подробнее тут {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/}.
 * В результате такой конфигурации в контексте приложения будет создано поле tasks,
 * через которое можно осуществлять связь между контролами, указав для контрола соответствующий storeId.
 * <pre class="brush: js; highlight: [2]">
 *    const loadConfig = {
 *       tasks: {
 *           dataFactoryName: 'Controls/dataFactory:List',
 *           dataFactoryArguments: {
 *              source: new SbisService({
 *                 ...
 *              }),
 *              root: 1,
 *              parentProperty: 'parent',
 *              nodeProperty: 'type',
 *              keyProperty: 'id'
 *          }
 *       }
 *    }
 * </pre>
 *
 * После конфигурации загрузчика данных, мы можем связать поиск и список, указав storeId.
 * Список построится по данным из загрузчика.
 * <pre class="brush: html">
 * <Controls-widgets.search:Input storeId='tasks'/>
 * <Controls.explorer:View storeId='tasks'/>
 * </pre>
 */
