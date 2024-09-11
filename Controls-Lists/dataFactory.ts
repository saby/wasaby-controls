/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
/**
 * Библиотека, содержащая фабрику данных списка.
 * @library Controls-Lists/dataFactory
 * @public
 * @includes IDataConfig Controls/dataFactory
 * @includes IListDataFactoryArguments Controls/dataFactory
 * @includes List Controls/dataFactory
 * @includes ListSlice Controls/dataFactory
 * @includes IListMobileDataFactoryArguments Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileDataFactoryArguments
 * @includes ExternalCollectionItemKeys Controls-Lists/_dataFactory/ListMobile/_interface/IExternalTypes
 * @includes ListMobile Controls-Lists/_dataFactory/ListMobile
 * @includes ListMobileSlice Controls-Lists/_dataFactory/ListMobile/Slice
 * @includes VirtualCollection Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection
 */

export { IDataConfig, IListDataFactoryArguments, List, ListSlice } from 'Controls/dataFactory';
export { IListMobileDataFactoryArguments } from './_dataFactory/ListMobile/_interface/IListMobileDataFactoryArguments';
export { ExternalCollectionItemKeys } from './_dataFactory/ListMobile/_interface/IExternalTypes';

export { default as ListMobile } from './_dataFactory/ListMobile';
export { default as ListMobileSlice } from './_dataFactory/ListMobile/Slice';
export { VirtualCollection } from './_dataFactory/ListMobile/_virtualCollection/VirtualCollection';
