/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

/**
 * Приватный интерфейс окон. Используется в работе менеджера окон и контроллеров.
 *
 * @interface Controls/_popup/interface/IPopup
 * @private
 */

export interface IPopupItem {
    shouldUpdateZIndex: boolean;
    contextIsTouch: boolean;
    targetCoords: any;
    trackIntervalId?: number;
    targetPosition?: DOMRect;
    id: string;
    modal: boolean;
    controller: IPopupController;
    popupOptions: IBasePopupOptions;
    isActive: boolean;
    waitDeactivated: boolean;
    sizes: IPopupSizes;
    activeControlAfterDestroy: Control;
    activeNodeAfterDestroy: HTMLElement;
    popupState: string;
    childs: IPopupItem[];
    removeInitiator?: 'innerTemplate' | 'opener';
    parentId?: string;
    hasParentPage?: boolean;
    closeId?: number;
    position?: IPopupPosition;
    currentZIndex?: number;
    className?: string;
    calculatedRestrictiveContainer?: HTMLElement;
    isDragOnPopup?: boolean; // Осуществляется ли d'n'd внутри окна
    _destroyDeferred?: Promise<undefined>;
    margins?: {
        top: number;
        left?: number;
        right?: number;
    };
    shouldNotUpdatePosition?: boolean;
}

export interface IPopupSizes {
    width?: number;
    height?: number;
    margins?: {
        top: number;
        left: number;
    };
}

export interface IPopupPosition {
    position?: string;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number | string;
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
    invisible?: boolean;
    hidden?: boolean;
    margin?: number;
    zoom?: number;
}

export interface IEventHandlers {
    onOpen?: Function;
    onClose?: Function;
    onResult?: Function;
}

export interface IPopupOptions extends IBasePopupOptions, IPopupWidthOptions, IPopupHeightOptions {
    hidden?: boolean;
    maximize?: boolean;
    autoClose?: boolean;
}

export interface IPopupWidthOptions {
    width?: number | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
    minWidth?: number;
    maxWidth?: number;
}

export interface IPopupHeightOptions {
    height?: number;
    minHeight?: number;
    maxHeight?: number;
}

export interface IDragOffset {
    x: number;
    y: number;
}

export interface IPopupController {
    TYPE: string;
    POPUP_STATE_INITIALIZING: string;
    POPUP_STATE_CREATED: string;
    POPUP_STATE_UPDATING: string;
    POPUP_STATE_UPDATED: string;
    POPUP_STATE_START_DESTROYING: string;
    POPUP_STATE_DESTROYING: string;
    POPUP_STATE_DESTROYED: string;

    elementMountedWrapper(item: IPopupItem, container: HTMLElement): boolean;

    elementCreatedWrapper(item: IPopupItem, container: HTMLElement): boolean;

    elementUpdatedWrapper(item: IPopupItem, container: HTMLElement): boolean;

    elementAfterUpdatedWrapper(item: IPopupItem, container: HTMLElement): boolean;

    beforeElementDestroyed(item: IPopupItem, container: HTMLElement): boolean;

    elementDestroyedWrapper(item: IPopupItem, container: HTMLElement): Promise<void>;

    getDefaultConfig(item: IPopupItem): Promise<void> | void | boolean;

    elementUpdateOptions(item: IPopupItem, container: HTMLElement): boolean | Promise<boolean>;

    updatePosition(item: IPopupItem, container: HTMLElement): boolean;

    orientationChanged(item: IPopupItem, container: HTMLElement): boolean;

    closePopupByOutsideClick(item: IPopupItem): void;

    popupDragStart(item: IPopupItem, container: HTMLElement, offset: IDragOffset): void;

    popupDragEnd(item: IPopupItem, offset: number): void;

    popupMouseEnter(item: IPopupItem): boolean;

    popupMouseLeave(item: IPopupItem): boolean;

    resizeInner(item: IPopupItem, container: HTMLElement): boolean;

    dragNDropOnPage(
        item: IPopupItem,
        container: HTMLElement,
        isInsideDrag: boolean,
        type: string
    ): boolean;

    popupMovingSize(item: IPopupItem, offset: object, position?: string): boolean;

    elementAnimated(item: IPopupItem, container: HTMLElement): boolean;

    elementMaximized(item: IPopupItem, container: HTMLElement, state: boolean): boolean;

    beforeUpdateOptions(item: IPopupItem): void;

    afterUpdateOptions(item: IPopupItem): void;

    workspaceResize(): boolean;

    needRecalcOnKeyboardShow(): boolean;
}

export interface IPopupItemInfo {
    id: string;
    type: string;
    parentId: string;
    parentZIndex: null | number;
    hasParentPage: boolean;
    popupOptions: IBasePopupOptions;
}

export default interface IPopup {
    readonly '[Controls/_popup/interface/IPopup]': boolean;
}
