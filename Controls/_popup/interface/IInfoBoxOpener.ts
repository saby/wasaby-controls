/**
 * @kaizen_zone 9d34dedd-48d0-4181-bbcf-6dc5fd6d9b10
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IEventHandlers, IPopupItemInfo } from './IPopup';
import { IInfoBoxOptions } from 'Controls/_popup/interface/IInfoBox';
import { IValidationStatusOptions } from 'Controls/interface';
import { List } from 'Types/collection';

/**
 * Интерфейс для опций всплывающих подсказок.
 *
 * @interface Controls/_popup/interface/IInfoBoxOpener
 * @implements Controls/interface:IValidationStatus
 * @private
 */

export interface IInfoBoxPopupOptions
    extends IInfoBoxOptions,
        IValidationStatusOptions,
        IControlOptions {
    target?: HTMLElement | EventTarget | Control;
    opener?: Control<IControlOptions, unknown>;
    maxWidth?: number;
    closeOnOutsideClick?: boolean;
    eventHandlers?: IEventHandlers;
    zIndexCallback?(item: IPopupItemInfo, popupList: List<IPopupItemInfo>): number;
    zIndex?: number; // TODO Compatible
    position?: string; // TODO старое, надо удалить
}

export interface IInfoBoxOpener {
    readonly '[Controls/_popup/interface/IInfoBoxOpener]': boolean;
}

/**
 * @typedef {Object} EventHandlers
 * @description Функции обратного вызова на события всплывающего окна.
 * @property {Function} onClose Функция обратного вызова, которая вызывается при закрытии всплывающего окна.
 * @property {Function} onResult Функция обратного вызова, которая вызывается в событии sendResult в шаблоне всплывающего окна.
 */

/*
 * @typedef {Object} EventHandlers
 * @description Callback functions on popup events.
 * @property {Function} onClose Callback function is called when popup is closed.
 * @property {Function} onResult Callback function is called at the sendResult event in the popup template.
 */

/**
 * Close popup.
 * @function Controls/_popup/interface/IInfoBoxOpener#close
 */

/**
 * @name Controls/_popup/interface/IInfoBoxOpener#isOpened
 * @function
 * @description Popup opened status.
 */

/**
 * Open popup.
 * @function Controls/_popup/interface/IInfoBoxOpener#open
 * @param {Object} Config
 * @returns {undefined}
 * @example
 * js
 * <pre>
 *   class MyControl extends Control<IControlOptions>{
 *      ...
 *
 *      _openInfobox() {
 *          var config= {
 *              message: 'My tooltip'
 *              target: this._children.buttonTarget //dom node
 *          }
 *          this._notify('openInfoBox', [config], {bubbling: true});
 *      }
 *
 *      _closeInfobox() {
 *          this._notify('closeInfoBox', [], {bubbling: true});
 *      }
 *   };
 * </pre>
 */

/**
 * Open InfoBox popup.
 * {@link /doc/platform/developmentapl/interface-development/controls/openers/infobox/ See more}.
 * @function Controls/_popup/interface/IInfoBoxOpener#openPopup
 * @param {Object} config InfoBox options. See {@link Controls/_popup/InfoBox description}.
 * @static
 * @see closePopup
 */

/**
 * Close InfoBox popup.
 * {@link /doc/platform/developmentapl/interface-development/controls/openers/infobox/ See more}.
 * @function Controls/_popup/interface/IInfoBoxOpener#closeInfoBox
 * @see openPopup
 * @static
 */
