/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
/**
 * Библиотека контролов, которые реализуют выезжающую панель фильтров</a>.
 * @library
 * @includes View Controls/_filterPanel/View
 * @includes Container Controls/_filterPanel/View/Container
 * @includes DateRangeEditor Controls/_filterPanel/Editors/DateRange
 * @includes DateEditor Controls/_filterPanel/Editors/Date
 * @includes DropdownEditor Controls/_filterPanel/Editors/Dropdown
 * @includes ListEditor Controls/_filterPanel/Editors/List
 * @includes BooleanEditor Controls/_filterPanel/Editors/Text
 * @includes LookupEditor Controls/_filterPanel/Editors/Lookup
 * @public
 */
import * as DefaultExtendedTemplate from 'wml!Controls/_filterPanel/ExtendedItems/DefaultExtendedTemplate';
export { default as View, IViewPanelOptions } from './_filterPanel/View';
export { default as ViewModel, IFilterViewModelOptions } from './_filterPanel/View/ViewModel';
export { default as BaseEditor, IBaseEditor } from './_filterPanel/BaseEditor';
export { default as TextEditor } from './_filterPanel/Editors/Text';
export { default as BooleanEditor } from './_filterPanel/Editors/Text';
export { default as DateMenuEditor } from './_filterPanel/Editors/DateMenu';
export { default as DateRangeEditor } from './_filterPanel/Editors/DateRange';
export { default as DateEditor } from './_filterPanel/Editors/Date';
export { default as DropdownEditor } from './_filterPanel/Editors/Dropdown';
export { ILookupEditorOptions } from './_filterPanel/Editors/Lookup/_BaseLookup';
export { default as LookupEditor } from './_filterPanel/Editors/Lookup';
export { default as LookupInputEditor } from './_filterPanel/Editors/LookupInput';
export { default as ListEditor } from './_filterPanel/Editors/List';
export { default as DragNDropProviderBase } from './_filterPanel/Editors/List/DragNDropProvider';
export { IListEditorOptions } from './_filterPanel/Editors/_List';
export { default as IEditorOptions } from './_filterPanel/_interface/IEditorOptions';
export { default as Container } from './_filterPanel/View/WrappedContainer';
export { MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS } from './_filterPanel/Constants';
export { IFrequentItem } from 'Controls/_filterPanel/Editors/resources/IFrequentItem';
export { IExtendedItemsOptions as IExtendedTemplateOptions } from './_filterPanel/ExtendedItems';
export { default as IExtendedPropertyValue } from './_filterPanel/_interface/IExtendedPropertyValue';
export { IExtendedItems } from './_filterPanel/ExtendedItems/IExtendedItems';
export { default as IDefaultExtendedTemplateOptions } from 'Controls/_filterPanel/ExtendedItems/IDefaultExtendedTemplate';

export { DefaultExtendedTemplate };
