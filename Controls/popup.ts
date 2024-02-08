/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
/**
 * Библиотека контролов, открывающих всплывающие окна. Существуют окна нескольких видов, которые различаются внешним видом и алгоритмом позиционирования.
 * @library
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
export { isVDOMTemplate } from './_popup/utils/isVdomTemplate';
export { loadModule, getModuleByName } from 'Controls/_popup/utils/moduleHelper';

export { isMouseEvent, MouseUp, MouseButtons } from 'Controls/_popup/utils/MouseEventHelper';
export { isLeftMouseButton, DependencyTimer, CalmTimer } from 'Controls/_popup/utils/FastOpen';
export { waitPrefetchData, IPrefetchData } from 'Controls/_popup/utils/Preload';
export { default as getAdaptiveDesktopMode } from 'Controls/_popup/utils/getAdaptiveDesktopMode';

// TODO: Удалить после перевода
export { default as ContextProvider, Context } from './_popup/Context/ContextProvider';
export { default as ContextConsumer } from './_popup/Context/ContextConsumer';
