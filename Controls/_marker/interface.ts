/**
 * @kaizen_zone 76d0517f-7dae-4c08-9a57-f5b6e1cc9bfe
 */
import type { Collection, CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import type { CrudEntityKey } from 'Types/source';
import type {
    CompatibleMultiColumnMarkerStrategy,
    CompatibleSingleColumnMarkerStrategy,
} from 'Controls/markerListAspect';

/**
 * Режимы отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @typedef {String} Controls/_marker/interface/IMarkerList/TVisibility
 * @variant visible Маркер отображается всегда, даже если не задана опция {@link markedKey}.
 * @variant hidden Маркер скрыт и не отображается для всех записей. Можно отключить выделение маркером для отдельной записи, о чем подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/#item здесь}.
 * @variant onactivated Макер отображается при активации списка, например при клике по записи.
 */
export type TVisibility = 'visible' | 'hidden' | 'onactivated';
export enum Visibility {
    Visible = 'visible',
    Hidden = 'hidden',
    OnActivated = 'onactivated',
}
export type TDirection = 'Down' | 'Up' | 'Left' | 'Right' | 'Forward' | 'Backward';

/**
 * Опции контроллера
 * @interface Controls/_marker/interface/IOptions
 * @public
 */
export interface IOptions extends IMarkerListOptions {
    model: Collection<Model, CollectionItem<Model>>;
    markerStrategy: IMarkerStrategyCtor;
    moveMarkerOnScrollPaging: boolean;
}
export type IMarkerStrategyCtor =
    | (new (
          ...args: ConstructorParameters<typeof CompatibleSingleColumnMarkerStrategy>
      ) => CompatibleSingleColumnMarkerStrategy)
    | (new (
          ...args: ConstructorParameters<typeof CompatibleMultiColumnMarkerStrategy>
      ) => CompatibleMultiColumnMarkerStrategy);

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера} в списках.
 * @interface Controls/_marker/interface/IMarkerList
 * @public
 */
export interface IMarkerListOptions {
    /**
     * @name Controls/_marker/interface/IMarkerList#markerVisibility
     * @cfg {Controls/_marker/interface/IMarkerList/TVisibility.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
     * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
     * @default onactivated
     * @see markedKey
     * @see markedKeyChanged
     * @see beforeMarkedKeyChanged
     * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
     */

    /* ENG
     * @cfg {String} Determines when marker is visible.
     * @variant visible The marker is always displayed, even if the marked key entry is not specified.
     * @variant hidden The marker is always hidden.
     * @variant onactivated - The marker is displayed on List activating. For example, when user mark a record.
     * @default onactivated
     * @demo Controls-demo/list_new/Marker/OnActivated/Index
     */
    markerVisibility?: TVisibility;

    /**
     * @name Controls/_marker/interface/IMarkerList#markedKey
     * @cfg {Types/source:ICrud#CrudEntityKey} Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
     * @remark
     * Если сделан bind на эту опцию, но она передана изначально в значении undefined,
     * то установка маркера работает аналогично тому, как если бы bind не был задан (по внутреннему состоянию контрола).
     * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
     * @see markerVisibility
     * @see markedKeyChanged
     * @see beforeMarkedKeyChanged
     * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
     */

    /* ENG
     * @cfg {Number} Identifier of the marked collection item.
     */
    markedKey?: CrudEntityKey;
}

/**
 * @name Controls/_marker/interface/IMarkerList#markedKeyChanged
 * @event Происходит при выделении пользователем элемента списка.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} key Ключ выбранного элемента.
 * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
 * @see markedKey
 * @see markerVisibility
 * @see beforeMarkedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */

/* ENG
 * @event Occurs when list item was selected (marked).
 * @name Controls/_marker/interface/IMarkerList#markedKeyChanged
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 * @param {Number} key Key of the selected item.
 */

/**
 * @name Controls/_marker/interface/IMarkerList#beforeMarkedKeyChanged
 * @event Происходит до изменения ключа {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} key Новый ключ маркера.
 * @demo Controls-demo/list_new/Marker/OnBeforeMarkedKeyChanged/Index
 * @remark
 * Из обработчика события нужно вернуть полученный ключ или новый ключ.
 * Либо можно вернуть промис с нужным ключом.
 * @see markedKey
 * @see markerVisibility
 * @see markedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */
