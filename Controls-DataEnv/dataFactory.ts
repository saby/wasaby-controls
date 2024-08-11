/**
 * Библиотека, содержащая фабрики данных.
 * @library
 * @public
 * @module
 */
export {
    IDataConfig,
    TDataConfigs,
    IDataConfigLoader,
    IOldDataConfig,
    TOldDataConfigs,
    TGetConfigResult,
    TConfigGetterModule,
    IConfigGetterModule
} from './_dataFactory/interface/IDataConfig';
export { IDataFactory, ISliceConstructorProps } from './_dataFactory/interface/IDataFactory';
export {
    IBaseDataFactoryArguments,
    IExtraValue,
    TExtraValues,
} from './_dataFactory/interface/IBaseDataFactoryArguments';

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
    default as FormSlice,
    IFormSlice, IFormSliceState,
    DataWrapper as DataWrapperSlice,
    IDataWrapperOptions as IDataWrapperSliceOptions,
    VALIDATION_STATE,
    NameBindingType,
    TValidationResult as TSliceValidationResult,
    IValidatorResult as ISliceValidatorResult,
    IValidator as ISliceValidator,
} from './_dataFactory/Form/Slice';
export {
    FormSliceActionType,
    IFormDataFactoryArguments,
    IFormDataFactoryResult,
    IFormDataFactory,
} from './_dataFactory/Form/IFormDataFactory';
export {
    ICustomDataFactoryArguments,
    ICustomDataFactory,
} from './_dataFactory/Custom/ICustomDataFactory';

export { default as DataConfigResolver, callGetConfig } from './_dataFactory/DataConfigResolver';
