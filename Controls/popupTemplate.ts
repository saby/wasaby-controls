/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
/**
 * Библиотека контролов, которые реализуют содержимое всплывающих окон.
 * @library
 * @includes IPopupTemplateBase Controls/_popupTemplate/interface/IPopupTemplateBase
 * @includes TStickyPosition Controls/_popupTemplate/TStickyPosition
 * @includes IResize Controls/_popupTemplate/interface/IResize
 * @includes InfoBox Controls/_popupTemplate/InfoBox
 * @includes Notification Controls/_popupTemplate/Notification/Base
 * @includes NotificationSimple Controls/_popupTemplate/Notification/Simple
 * @includes INotification Controls/_popupTemplate/interface/INotification
 * @includes IPopupTemplate Controls/_popupTemplate/interface/IPopupTemplate
 * @includes IPopupTemplateBase Controls/_popupTemplate/interface/IPopupTemplateBase
 * @includes IResize Controls/_popupTemplate/interface/IResize
 * @includes IResizingArrow Controls/_popupTemplate/interface/IResizingArrow
 * @includes Dialog Controls/_popupTemplate/Dialog
 * @includes Stack Controls/_popupTemplate/Stack
 * @includes Sticky Controls/_popupTemplate/Sticky
 * @includes StackPageWrapper Controls/_popupTemplate/StackPageWrapper
 * @public
 */

export { ContextProvider, Context, type IContext } from 'Controls/popup';
export { ContextConsumer } from 'Controls/popup';

export {
    IStackItem,
    getRightPanelWidth,
    getPopupWidth,
    IStackSavedConfig,
    initializationConstants,
    initializationPopupConstants,
    BASE_WIDTH_SIZES,
    BASE_WIDTHS_POPUP,
    RIGHT_PANEL_WIDTH,
    MIN_MAXIMIZED_WIDTH,
    getMaximizedState,
    getMiddleWidth,
} from 'Controls/_popupTemplate/Util/PopupStackUtils';
export { default as StackPageWrapper } from 'Controls/_popupTemplate/Stack/Template/StackPageWrapper';
export { default as StackPageWrapperContextProvider } from 'Controls/_popupTemplate/Stack/Template/StackPageWrapper/ContextProvider';
export { default as themeInitConstants } from 'Controls/_popupTemplate/Util/getThemeConstants';

export {
    IStackTemplateOptions,
    IRightPanelOptions,
} from 'Controls/_popupTemplate/Stack/Template/Stack';

export { default as Stack } from 'Controls/_popupTemplate/Stack/Template/StackReact';
export { default as StackForTest } from 'Controls/_popupTemplate/Stack/Template/Stack';

export { default as BaseStack } from 'Controls/_popupTemplate/Stack/Template/BaseStack';

export { IDialogTemplateOptions } from 'Controls/_popupTemplate/Dialog/Template/Dialog';

export { default as Dialog } from 'Controls/_popupTemplate/Dialog/Template/DialogReact';

export { IStickyTemplateOptions } from 'Controls/_popupTemplate/Sticky/Template/Sticky';

export { default as Sticky } from 'Controls/_popupTemplate/Sticky/Template/StickyReact';

export { default as Page } from 'Controls/_popupTemplate/Page';

export {
    Template as Confirmation,
    DialogTemplate as ConfirmationDialog,
} from 'Controls/popupConfirmation';
export {
    default as InfoBox,
    IInfoboxTemplateOptions,
    TStyle,
} from 'Controls/_popupTemplate/InfoBox/Template/InfoBox';
export { default as templateInfoBox } from 'Controls/_popupTemplate/InfoBox/Template/Simple/template';
export {
    default as Notification,
    NotificationWithoutWrapper,
} from 'Controls/_popupTemplate/Notification/Template/Base';
export { default as NotificationSimple } from 'Controls/_popupTemplate/Notification/Template/Simple';
export {
    INotification,
    INotificationOptions,
} from 'Controls/_popupTemplate/interface/INotification';

export { IResizeOptions, IResizingOptions } from 'Controls/_popupTemplate/interface/IResize';
export {
    IResizingArrow,
    IResizingArrowPosition,
} from 'Controls/_popupTemplate/interface/IResizingArrow';

export {
    default as IPopupTemplate,
    IPopupTemplateOptions,
} from 'Controls/_popupTemplate/interface/IPopupTemplate';
export {
    default as IPopupTemplateBase,
    IPopupTemplateBaseOptions,
} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
export { default as ResizingArrow } from 'Controls/_popupTemplate/ResizingArrow';
// Удалить
export { default as DialogHeader } from 'Controls/_popupTemplate/Dialog/Template/Header'; // В рознице
