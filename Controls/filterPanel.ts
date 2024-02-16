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
export { default as View, IViewPanelOptions, TPanelOrientation } from './_filterPanel/View';
export { TEditorsViewMode } from './_filterPanel/View/ViewModel';
export { default as ViewModel, IFilterViewModelOptions } from './_filterPanel/View/ViewModel';
export { default as BaseEditor, IBaseEditor } from './_filterPanel/BaseEditor';
export { default as ListEditor } from './_filterPanel/Editors/List';
export { default as DragNDropProviderBase } from './_filterPanel/Editors/List/DragNDropProvider';
export { IListEditorOptions } from './_filterPanel/Editors/_List';
export { default as IEditorOptions } from './_filterPanel/_interface/IEditorOptions';
export {
    isFrequentFilterItem,
    getExtendedItems,
    getAdditionalItems,
    viewModeFilter,
    isExtendedItem,
    isExtendedItemCurrent,
} from 'Controls/_filterPanel/View/ExtendedItemsUtil';
export { default as IExtendedPropertyValue } from 'Controls/_filterPanel/_interface/IExtendedPropertyValue';
