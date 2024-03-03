/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
/**
 * Библиотека контролов, которые реализуют логику всплывающих окон.
 * @library
 * @public
 */
export {
    default as StackController,
    StackController as StackControllerClass,
} from 'Controls/_popupTemplateStrategy/Stack/StackController';
export { default as DialogController } from 'Controls/_popupTemplateStrategy/Dialog/DialogController';
export * as DialogContent from 'wml!Controls/_popupTemplateStrategy/Dialog/DialogContent';
export { default as StickyController } from 'Controls/_popupTemplateStrategy/Sticky/StickyController';
export { default as PreviewerController } from 'Controls/_popupTemplateStrategy/Previewer/PreviewerController';
export { default as InfoBoxController } from 'Controls/_popupTemplateStrategy/InfoBox/InfoBoxController';
export { default as NotificationController } from 'Controls/_popupTemplateStrategy/Notification/NotificationController';
export { default as BaseController } from 'Controls/_popupTemplateStrategy/BaseController';
export { getPopupWidth } from 'Controls/_popupTemplateStrategy/Util/PopupWidthSettings';
export { default as Controller } from 'Controls/_popupTemplateStrategy/PopupController/Controller';
export { default as Popup } from 'Controls/_popupTemplateStrategy/PopupController/Popup/Popup';
export { default as GlobalController } from 'Controls/_popupTemplateStrategy/PopupController/GlobalController/GlobalController';
export { findPopupParentId } from 'Controls/_popupTemplateStrategy/PopupController/Utils/findPopupParentId';
export { default as PageController } from 'Controls/_popupTemplateStrategy/PopupController/PageController/Controller';

// Удалить
export { default as StackStrategy } from 'Controls/_popupTemplateStrategy/Stack/StackStrategy'; // для CompoundArea
