/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
/**
 * Библиотека контролов, которые реализуют панель фильтрации и её содержимое.
 * @library
 * @includes Panel Controls/_filterPopup/Panel
 * @includes DetailPanel Controls/_filterPopup/DetailPanel
 * @includes SimplePanel Controls/_filterPopup/SimplePanel
 * @includes SimplePanelEmptyItemTemplate Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate
 * @includes SimplePanelHierarchyItemTemplate Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate
 * @includes Link Controls/_filterPopup/Panel/Link
 * @includes Select Controls/_filterPopup/Panel/Select
 * @includes Dropdown Controls/_filterPopup/Panel/Dropdown
 * @includes Text Controls/_filterPopup/Panel/Text
 * @includes Lookup Controls/_filterPopup/Panel/Lookup
 * @includes HierarchyLookup Controls/_filterPopup/Panel/HierarchyLookup
 * @includes IFilterButton Controls/_filterPopup/interface/IFilterPanel
 * @public
 */

/*
 * filterPopup library
 * @library
 * @includes Panel Controls/_filterPopup/Panel
 * @includes DetailPanel Controls/_filterPopup/DetailPanel
 * @includes SimplePanel Controls/_filterPopup/SimplePanel
 * @includes SimplePanelEmptyItemTemplate Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate
 * @includes Link Controls/_filterPopup/Panel/Link
 * @includes Select Controls/_filterPopup/Panel/Select
 * @includes Dropdown Controls/_filterPopup/Panel/Dropdown
 * @includes Text Controls/_filterPopup/Panel/Text
 * @includes Lookup Controls/_filterPopup/Panel/Lookup
 * @includes HierarchyLookup Controls/_filterPopup/Panel/HierarchyLookup
 * @includes AdditionalPanelTemplate Controls/_filterPopup/Panel/AdditionalParams/Render
 * @includes IFilterButton Controls/_filterPopup/interface/IFilterPanel
 * @public
 * @author Крайнов Д.О.
 */

import Panel = require('Controls/_filterPopup/Panel');
import SimplePanelItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/itemTemplate');
import SimplePanelEmptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import SimplePanelHierarchyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate');
import _List = require('Controls/_filterPopup/SimplePanel/_List');
import _HierarchyList = require('Controls/_filterPopup/SimplePanel/_HierarchyList');
import * as SelectItemTemplate from 'wml!Controls/_filterPopup/Panel/Select/ItemTemplate';

import DetailPanel = require('Controls/_filterPopup/DetailPanel');

export { default as SimplePanel } from 'Controls/_filterPopup/SimplePanel';
export { default as HierarchyLookup } from 'Controls/_filterPopup/Panel/HierarchyLookup';
export { default as _EditDialog } from 'Controls/_filterPopup/History/_EditDialog';
export { default as Link } from 'Controls/_filterPopup/Panel/Link';
export { default as Lookup } from 'Controls/_filterPopup/Panel/Lookup';
export { default as Text } from 'Controls/_filterPopup/Panel/Text';
export { default as Dropdown } from 'Controls/_filterPopup/Panel/Dropdown';
export { default as Select } from 'Controls/_filterPopup/Panel/Select';
export { default as AdditionalPanelTemplate } from 'Controls/_filterPopup/Panel/AdditionalParams/Render';
export { default as IVisibilityChanged } from 'Controls/_filterPopup/interface/IVisibilityChanged';

export {
    DetailPanel as Panel,
    DetailPanel,
    SimplePanelItemTemplate,
    SimplePanelEmptyItemTemplate,
    SimplePanelHierarchyItemTemplate,
    SelectItemTemplate,
    _List,
    _HierarchyList,
};
