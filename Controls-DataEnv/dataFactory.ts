/**
 * Библиотека, содержащая фабрики данных.
 * @library
 * @public
 * @includes IDataConfig Controls-DataEnv/_dataFactory/interface/IDataConfig
 * @includes IDataFactory Controls-DataEnv/_dataFactory/interface/IDataFactory
 */
export { IDataConfig, TDataConfigs } from './_dataFactory/interface/IDataConfig';
export { IDataFactory, IBaseDataFactoryArguments } from './_dataFactory/interface/IDataFactory';

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
export {
    ICustomDataFactoryArguments,
    ICustomDataFactory,
} from './_dataFactory/Custom/ICustomDataFactory';
