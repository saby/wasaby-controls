/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */

/**
 * Интерфейс для окон, поддерживающих адаптивность.
 * @interface Controls/_popup/interface/IAdaptivePopup
 * @public
 */
export interface IAdaptivePopup {
    readonly '[Controls/_popup/interface/IAdaptivePopup]': boolean;
}

export interface IAdaptivePopupOptions {
    allowAdaptive?: boolean;
}

/**
 * @name Controls/_popup/interface/IAdaptivePopup#allowAdaptive
 * @cfg {Boolean} Определяет адаптивность окна на мобильных устройствах.
 * @remark
 * Значение по умолчанию зависит от типа окна.
 * Stack - изначально опция имеет значение false, а значит по умолчанию окно откроется в таком же виде, как и на desktop.
 * Dialog и Sticky - изначально опция имеет значение true, а значит по умолчанию окно откроется как шторка.
 */
