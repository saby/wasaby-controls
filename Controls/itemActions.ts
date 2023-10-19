/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
/**
 * Библиотека, которая предоставляет операции с записью коллекции.
 * @library
 * @includes ActionsComponent Controls/_itemActions/resources/templatesReact/ActionsComponent
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
export { Utils, MENU_BUTTON_KEY } from './_itemActions/Utils';

import { default as ActionsComponent } from 'Controls/_itemActions/resources/templatesReact/ActionsComponent';
import { default as ItemActionsTemplate } from 'Controls/_itemActions/resources/templatesReact/ItemActionsTemplate';
import { default as SwipeActionTemplate } from 'Controls/_itemActions/resources/templatesReact/SwipeAction';
import { default as SwipeActionsTemplate } from 'Controls/_itemActions/resources/templatesReact/SwipeTemplate';
import {
    EDITING_APPLY_BUTTON_KEY,
    EDITING_CLOSE_BUTTON_KEY,
    TItemActionShowType,
    TActionDisplayMode,
} from 'Controls/_itemActions/constants';

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
};
