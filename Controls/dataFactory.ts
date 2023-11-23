/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Библиотека, содержащая фабрику данных списка.
 * @library
 * @public
 * @includes List Controls/_dataFactory/List/_interface/IListDataFactory
 * @includes IListState Controls/_dataFactory/List/_interface/IListState
 * @includes IListLoadResult Controls/_dataFactory/List/_interface/IListLoadResult
 * @includes IListDataFactoryArguments Controls/_dataFactory/List/_interface/IListDataFactoryArguments
 * @includes AbstractListSlice Controls/_dataFactory/AbstractList/AbstractListSlice
 * @includes ListSlice Controls/_dataFactory/List/Slice
 */

import { IBaseDataFactoryArguments, IDataFactory } from './_dataFactory/interface/IDataFactory';
import { IDataConfig } from './_dataFactory/interface/IDataConfig';
import {
    ICustomDataFactory,
    ICustomDataFactoryArguments,
} from './_dataFactory/interface/ICustomDataFactory';
import {
    IAreaDataFactoryArguments,
    IAreaDataFactory,
    IAreaDataFactoryResult,
} from './_dataFactory/interface/IAreaDataFactory';
import {
    IListDataFactoryLoadResult,
    IListDataFactory,
} from './_dataFactory/List/_interface/IListDataFactory';

export { default as List } from './_dataFactory/List';
export { default as CompatibleList } from './_dataFactory/CompatibleList';
export { default as Custom } from './_dataFactory/Custom';
export { default as Area } from './_dataFactory/Area';
export { default as PropertyGrid } from './_dataFactory/PropertyGrid';
export {
    IListState,
    IErrorConfig as IListSliceErrorConfig,
} from './_dataFactory/List/_interface/IListState';
export { IListDataFactoryArguments } from './_dataFactory/List/_interface/IListDataFactoryArguments';
export { IListLoadResult } from './_dataFactory/List/_interface/IListLoadResult';
export { default as ListSlice } from './_dataFactory/List/Slice';
export {
    IBaseDataFactoryArguments,
    IDataFactory,
    ICustomDataFactory,
    IDataConfig,
    ICustomDataFactoryArguments,
    IAreaDataFactoryArguments,
    IAreaDataFactory,
    IAreaDataFactoryResult,
    IListDataFactoryLoadResult,
    IListDataFactory,
};

export {
    IListChange,
    IListChangeName,
    IListChangeSource,
} from './_dataFactory/AbstractList/_interface/IListChanges';
export { MarkerStateManager } from './_dataFactory/AbstractList/aspects/Marker/MarkerStateManager';
export { IMarkerState } from './_dataFactory/AbstractList/aspects/Marker/IMarkerState';
export {
    ExpandCollapseStateManager,
    ALL_EXPANDED_VALUE,
} from './_dataFactory/AbstractList/aspects/ExpandCollapse/ExpandCollapseStateManager';
export { IExpandCollapseState } from './_dataFactory/AbstractList/aspects/ExpandCollapse/IExpandCollapseState';
export { PathStateManager } from './_dataFactory/AbstractList/aspects/Path/PathStateManager';
export { IPathState } from './_dataFactory/AbstractList/aspects/Path/IPathState';
export { SelectionStateManager } from './_dataFactory/AbstractList/aspects/Selection/SelectionStateManager';
export { ISelectionState } from './_dataFactory/AbstractList/aspects/Selection/ISelectionState';
export {
    ItemsStateManager,
    FirstItemKeySymbol,
} from './_dataFactory/AbstractList/aspects/Items/ItemsStateManager';
export { IItemsState } from './_dataFactory/AbstractList/aspects/Items/IItemsState';
export { RootStateManager } from './_dataFactory/AbstractList/aspects/Root/RootStateManager';
export { IRootState } from './_dataFactory/AbstractList/aspects/Root/IRootState';
export { AbstractAspectStateManager } from './_dataFactory/AbstractList/aspects/abstract/AbstractAspectStateManager';
export { TListAspects } from './_dataFactory/AbstractList/aspects/factory';
export { TCollectionType } from './_dataFactory/AbstractList/_interface/IAbstractListSliceTypes';
