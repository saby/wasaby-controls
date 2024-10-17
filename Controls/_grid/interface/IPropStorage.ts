/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
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
