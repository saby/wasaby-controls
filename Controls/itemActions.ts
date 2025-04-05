/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
/**
 * Библиотека, которая предоставляет операции с записью коллекции.
 * @library
 * @includes ActionsComponent Controls/_itemActions/render/ActionsComponent
 * @includes IItemActions Controls/_itemActions/interface/IItemActions
 * @includes IItemAction Controls/_interface/IAction
 * @includes TActionDisplayMode Controls/itemActions/TActionDisplayMode
 * @includes TItemActionShowType Controls/itemActions/TItemActionShowType
 * @includes TActionAlignment Controls/_itemActions/interface/IItemActionsTemplateConfig/IItemActionsTemplateProps/TActionAlignment
 * @public
 */

/*
 * Library that provides collection item actions
 * @library
 * @public
 * @author Аверкиев П.А.
 */
import 'css!Controls/itemActions';

import type {
    TItemActionVisibilityCallback,
    TEditArrowVisibilityCallback,
    TItemActionsPosition,
    TActionCaptionPosition,
    TItemActionViewMode,
    TItemActionsSize,
    IItemAction,
} from './interface';

export {
    IShownItemAction as IAction,
    IItemActionsObject,
} from './_itemActions/interface/IItemActionsObject';
export { IContextMenuConfig } from './_itemActions/interface/IContextMenuConfig';
export { IItemActionsItem } from './_itemActions/interface/IItemActionsItem';
export { IItemActionsCollection } from './_itemActions/interface/IItemActionsCollection';
export {
    IItemActionsTemplateConfig,
    TActionAlignment,
    IItemActionsTemplateProps,
    TApplyButtonStyle,
} from './_itemActions/interface/IItemActionsTemplateConfig';
export {
    IItemActionsOptions,
    TItemActionsVisibility,
} from './_itemActions/interface/IItemActionsOptions';
export {
    Controller,
    IItemActionsTemplateMountedCallback,
    IItemActionsTemplateUnmountedCallback,
    IControllerOptions,
} from './_itemActions/Controller';
import { ActionsStyleUtils } from './_itemActions/utils/ActionsStyleUtils';
import { ActionsMapUtils } from './_itemActions/utils/ActionsMapUtils';

export { ActionsMenuUtils } from './_itemActions/utils/ActionsMenuUtils';
export { SwipeUtils } from './_itemActions/utils/SwipeUtils';
export { ItemActionsContext } from './_itemActions/context/Context';
export { default as Container } from './_itemActions/Container';
export { default as ToolbarChooser } from './_itemActions/render/ToolbarChooserConnectedComponent';

import { default as ActionsComponent } from 'Controls/_itemActions/render/ActionsComponent';
import { default as ItemActionsTemplate } from 'Controls/_itemActions/render/ItemActionsTemplate';
import { default as SwipeActionTemplate } from 'Controls/_itemActions/render/SwipeAction';
import { default as SwipeActionsTemplate } from 'Controls/_itemActions/render/SwipeTemplate';
import {
    MENU_BUTTON_KEY,
    EDITING_APPLY_BUTTON_KEY,
    EDITING_CLOSE_BUTTON_KEY,
    TItemActionShowType,
    TActionDisplayMode,
} from 'Controls/_itemActions/constants';

// Совместиость со старыми экспортами (для юнитов)
export const Utils = {
    getMenuButton: ActionsMapUtils.getMenuButton,
};

export {
    ActionsComponent,
    ItemActionsTemplate,
    SwipeActionTemplate,
    SwipeActionsTemplate,
    EDITING_APPLY_BUTTON_KEY,
    EDITING_CLOSE_BUTTON_KEY,
    TItemActionShowType,
    TActionDisplayMode,
    TItemActionVisibilityCallback,
    TEditArrowVisibilityCallback,
    TItemActionsPosition,
    TActionCaptionPosition,
    TItemActionViewMode,
    TItemActionsSize,
    IItemAction,
    MENU_BUTTON_KEY,
    ActionsStyleUtils,
    ActionsMapUtils,
};
