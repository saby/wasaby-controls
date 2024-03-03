/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
/**
 * Интерфейс для списочных контролов, сохраняющих пользовательскую конфигурацию.
 * @public
 */

export interface IPropStorage {
    /**
     * @cfg {String} Уникальный идентификатор, по которому в хранилище данных будет сохранена конфигурация контрола.
     * @remark В {@link /doc/platform/developmentapl/interface-development/controls/list/ списочных контролах}, в том числе {@link Controls/sorting:Selector}, такое хранилище используется для сохранения выбранной {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
     */
    propStorageId?: string;
}
