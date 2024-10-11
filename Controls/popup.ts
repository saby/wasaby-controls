/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
/**
 * Библиотека контролов, открывающих всплывающие окна. Существуют окна нескольких видов, которые различаются внешним видом и алгоритмом позиционирования.
 * @library
 * @includes IAdaptivePopup Controls/_popup/interface/IAdaptivePopup
 * @includes IBaseOpener Controls/_popup/interface/IBaseOpener
 * @includes IBasePopupOptions Controls/_popup/interface/IBasePopupOptions
 * @includes IConfirmationOpener Controls/_popup/interface/IConfirmationOpener
 * @includes IConfirmationFooter Controls/_popup/interface/IConfirmationFooter
 * @includes IDialogOpener Controls/_popup/interface/IDialogOpener
 * @includes IEditOpener Controls/_popup/interface/IEditOpener
 * @includes IEventHandlersOptions Controls/_popup/interface/IEventHandlersOptions
 * @includes IInfoBoxOptions Controls/_popup/interface/IInfoBoxOptions
 * @includes IInfoBoxOpener Controls/_popup/interface/IInfoBoxOpener
 * @includes INotificationOpener Controls/_popup/interface/INotificationOpener
 * @includes IPopupItem Controls/_popup/interface/IPopup
 * @includes IPopupWidth Controls/_popup/interface/IPopupWidth
 * @includes IPreviewer Controls/_popup/interface/IPreviewer
 * @includes ISlidingPanel Controls/_popup/interface/ISlidingPanel
 * @includes IStackOpener Controls/_popup/interface/IStackOpener
 * @includes IStickyOpener Controls/_popup/interface/IStickyOpener
 * @includes ILoadConfigOptions Controls/_popup/interface/ILoadConfigOptions
 * @includes Opener Controls/_popup/Opener
 * @includes DialogOpener Controls/_popup/DialogOpener
 * @includes SlidingPanelOpener Controls/_popup/SlidingPanelOpener
 * @includes StackOpener Controls/_popup/StackOpener
 * @includes StickyOpener Controls/_popup/StickyOpener
 * @includes Confirmation Controls/_popup/Confirmation
 * @includes Dialog Controls/_popup/Dialog
 * @includes Infobox Controls/_popup/Infobox
 * @includes Notification Controls/_popup/Notification
 * @includes Stack Controls/_popup/Stack
 * @includes Sticky Controls/_popup/Sticky
 * @includes Edit Controls/_popup/Edit
 * @includes registerServerSidePopup Controls/_popup/utils/registerServerSidePopup
 * @public
 */

/*
 * popup library
 * @library
 * @public
 * @author Крайнов Д.О.
 */

export { default as Container, ContainerForTest } from './_popup/Popup/Container';
export { default as Controller } from './_popup/Popup/GlobalController';
// TODO: Удалить после правки у прикладников
export { default as PageController } from './_popup/Popup/GlobalController';

export { default as Opener } from './_popup/Opener';

export { default as BaseOpener } from 'Controls/_popup/WasabyOpeners/BaseOpener';
export { default as Stack } from './_popup/WasabyOpeners/Stack';
export { default as Dialog } from './_popup/WasabyOpeners/Dialog';
export { default as Sticky } from './_popup/WasabyOpeners/Sticky';
export { default as Confirmation } from './_popup/WasabyOpeners/Confirmation';
export { default as Notification } from 'Controls/_popup/WasabyOpeners/Notification';
export { default as Infobox } from './_popup/WasabyOpeners/InfoBox';
export { default as Previewer } from './_popup/WasabyOpeners/Previewer';
export { default as Edit } from './_popup/WasabyOpeners/Edit';
import EditContainer = require('wml!Controls/_popup/WasabyOpeners/Edit/WrappedContainer');

export { EditContainer };

export { default as BaseHelperOpener } from './_popup/Openers/Base';
export { default as StackOpener } from './_popup/Openers/Stack';
export { default as StickyOpener } from './_popup/Openers/Sticky';
export { default as DialogOpener } from './_popup/Openers/Dialog';
export { default as NotificationOpener } from './_popup/Openers/Notification';
export { default as SlidingPanelOpener } from './_popup/Openers/SlidingPanel';
export { registerServerSidePopup } from './_popup/ServerSidePopupUtils';

export {
    default as IPopup,
    IPopupOptions,
    IPopupItem,
    IPopupSizes,
    IPopupPosition,
    IEventHandlers,
    IPopupItemInfo,
    IPopupController,
    IDragOffset,
} from './_popup/interface/IPopup';
export { IBaseOpener, IDataLoader, IOpener } from './_popup/interface/IBaseOpener';
export { IBasePopupOptions, InitializingWay } from './_popup/interface/IBasePopupOptions';
export { IPopupWidthOptions, IPopupWidth, TPopupWidth } from './_popup/interface/IPopupWidth';
export { IEventHandlersOptions } from './_popup/interface/IEventHandlers';
export { IStackPopupOptions, IStackOpener } from './_popup/interface/IStack';
export {
    IStickyPopupOptions,
    IStickyPosition,
    IStickyPopupPosition,
    IStickyPositionOffset,
    IStickyOpener,
    TTarget,
} from './_popup/interface/ISticky';
export {
    IDialogPopupOptions,
    IDialogOpener,
    IResizeDirection,
    TWidth,
} from './_popup/interface/IDialog';
export { IConfirmationOptions, IConfirmationOpener } from './_popup/interface/IConfirmation';
export { INotificationPopupOptions, INotificationOpener } from './_popup/interface/INotification';
export { IPreviewerOptions, IPreviewer } from './_popup/interface/IPreviewer';
export { IInfoBoxOptions, IInfoBox } from './_popup/interface/IInfoBox';
export { IInfoBoxPopupOptions, IInfoBoxOpener } from './_popup/interface/IInfoBoxOpener';
export { IEditOptions, IEditOpener } from './_popup/interface/IEdit';
export {
    ISlidingPanelPopupOptions,
    ISlidingPanelOptions,
    ISlidingPanel,
} from './_popup/interface/ISlidingPanel';
export { IAdaptivePopup, IAdaptivePopupOptions } from './_popup/interface/IAdaptivePopup';
export { ILoadConfigOptions } from './_popup/interface/ILoadConfig';

export { isVDOMTemplate } from './_popup/utils/isVdomTemplate';
export { loadModule, getModuleByName } from 'Controls/_popup/utils/moduleHelper';
export { default as getPopupComponent } from 'Controls/_popup/utils/getPopupComponent';

export { isMouseEvent, MouseUp, MouseButtons } from 'Controls/_popup/utils/MouseEventHelper';
export { isLeftMouseButton, DependencyTimer, CalmTimer } from 'Controls/_popup/utils/FastOpen';
export { waitPrefetchData, IPrefetchData } from 'Controls/_popup/utils/Preload';
export { default as getAdaptiveDesktopMode } from 'Controls/_popup/utils/getAdaptiveDesktopMode';

// TODO: Удалить после перевода
export { default as ContextProvider, Context, IContext } from './_popup/Context/ContextProvider';
export { default as ContextConsumer } from './_popup/Context/ContextConsumer';
