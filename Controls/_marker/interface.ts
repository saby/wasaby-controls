/**
 * @kaizen_zone 8a007aef-e1f2-4f41-bc80-24c6788c18db
 */
import type { Collection, CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import type {
    CompatibleMultiColumnMarkerStrategy,
    CompatibleSingleColumnMarkerStrategy,
} from 'Controls/listAspects';
import { TKey } from 'Controls/interface';

export type TMarkerController = typeof import('Controls/marker').MarkerController;

/**
 * Режимы отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @typedef TVisibility
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
 * @public
 */
export interface IMarkerListOptions {
    /**
     * Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
     * @cfg
     * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
     * @default onactivated
     * @see markedKey
     * @see markedKeyChanged
     * @see beforeMarkedKeyChanged
     * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
     */
    markerVisibility?: TVisibility;

    /**
     * Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
     * @cfg
     * @remark
     * Если сделан bind на эту опцию, но она передана изначально в значении undefined,
     * то установка маркера работает аналогично тому, как если бы bind не был задан (по внутреннему состоянию контрола).
     * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
     * @see markerVisibility
     * @see markedKeyChanged
     * @see beforeMarkedKeyChanged
     * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
     */
    markedKey?: TKey;
}

/**
 * @name Controls/_marker/interface/IMarkerListOptions#markedKeyChanged
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
 * @name Controls/_marker/interface/IMarkerListOptions#beforeMarkedKeyChanged
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
