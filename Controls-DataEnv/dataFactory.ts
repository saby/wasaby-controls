/**
 * Библиотека, содержащая фабрики данных.
 * @library
 * @public
 * @includes IDataConfig Controls-DataEnv/_dataFactory/interface/IDataConfig
 * @includes IDataFactory Controls-DataEnv/_dataFactory/interface/IDataFactory
 * @includes IDataFactory Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments
 */
export { IDataConfig, TDataConfigs } from './_dataFactory/interface/IDataConfig';
export { IDataFactory } from './_dataFactory/interface/IDataFactory';
export { IBaseDataFactoryArguments } from './_dataFactory/interface/IBaseDataFactoryArguments';

export {
    IAreaDataFactoryResult,
    IAreaDataFactory,
    IAreaDataFactoryArguments,
} from './_dataFactory/Area/IAreaDataFactory';
export { default as AreaSlice, IAreaState } from './_dataFactory/Area/Slice';
export { default as Area } from './_dataFactory/Area/Factory';
export { default as CompatibleArea } from './_dataFactory/Area/CompatibleFactory';
export { default as Custom } from './_dataFactory/Custom/Factory';
export { default as CompatibleCustom } from './_dataFactory/Custom/CompatibleFactory';
export { default as Form } from './_dataFactory/Form/Factory';
export { default as FormSlice, IFormSlice } from './_dataFactory/Form/Slice';
export { FormSliceActionType } from './_dataFactory/Form/IFormDataFactory';
export {
    ICustomDataFactoryArguments,
    ICustomDataFactory,
} from './_dataFactory/Custom/ICustomDataFactory';
