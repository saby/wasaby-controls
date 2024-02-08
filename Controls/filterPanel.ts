/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
/**
 * Библиотека контролов, которые реализуют выезжающую панель фильтров</a>.
 * @library
 * @includes View Controls/_filterPanel/View
 * @includes DateRangeEditor Controls/_filterPanel/Editors/DateRange
 * @includes DateEditor Controls/_filterPanel/Editors/Date
 * @includes DropdownEditor Controls/_filterPanel/Editors/Dropdown
 * @includes ListEditor Controls/_filterPanel/Editors/List
 * @includes BooleanEditor Controls/_filterPanel/Editors/Text
 * @includes LookupEditor Controls/_filterPanel/Editors/Lookup
 * @public
 */
import * as DefaultExtendedTemplate from 'wml!Controls/_filterPanel/ExtendedItems/DefaultExtendedTemplate';
export { default as View, IViewPanelOptions, TPanelOrientation } from './_filterPanel/View';
export { TEditorsViewMode } from './_filterPanel/View/ViewModel';
export { default as ViewModel, IFilterViewModelOptions } from './_filterPanel/View/ViewModel';
export { default as BaseEditor, IBaseEditor } from './_filterPanel/BaseEditor';
export { default as ListEditor } from './_filterPanel/Editors/List';
export { default as DragNDropProviderBase } from './_filterPanel/Editors/List/DragNDropProvider';
export { IListEditorOptions } from './_filterPanel/Editors/_List';
export { default as IEditorOptions } from './_filterPanel/_interface/IEditorOptions';
export { MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS } from './_filterPanel/Constants';
export { IExtendedItemsOptions as IExtendedTemplateOptions } from './_filterPanel/ExtendedItems';
export { default as IExtendedPropertyValue } from './_filterPanel/_interface/IExtendedPropertyValue';
export { IExtendedItems } from './_filterPanel/ExtendedItems/IExtendedItems';

export { DefaultExtendedTemplate };
