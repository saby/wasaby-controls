/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
/**
 * Библиотека, содержащая фабрику данных списка.
 * @library Controls-Lists/dataFactory
 * @public
 * @includes ListMobile Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileDataFactory
 * @includes ListMobileSlice Controls-Lists/_dataFactory/ListMobile/Slice
 */

export { IDataConfig, IListDataFactoryArguments, List, ListSlice } from 'Controls/dataFactory';
export { IListMobileDataFactoryArguments } from './_dataFactory/ListMobile/_interface/IListMobileDataFactoryArguments';
export { ExternalCollectionItemKeys } from './_dataFactory/ListMobile/_interface/IExternalTypes';

export { default as ListMobile } from './_dataFactory/ListMobile';
export { default as ListMobileSlice } from './_dataFactory/ListMobile/Slice';
export { VirtualCollection } from './_dataFactory/ListMobile/_virtualCollection/VirtualCollection';
