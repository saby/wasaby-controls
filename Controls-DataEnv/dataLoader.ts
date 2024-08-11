/**
 * Библиотека, содержащая загрузчик данных
 * @library
 * @public
 * @module
 */

export {
    default as Loader,
    TConfigLoadResult,
    IDataConfigLoadResult,
    ILoadedDataConfigsResult,
    ILoadDataConfigResultSerializable,
} from './_dataLoader/Loader';

export { TDataConfigs } from 'Controls-DataEnv/dataFactory';
