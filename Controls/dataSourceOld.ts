/**
 * Временная библиотека устаревшего загрузчика бывшего Controls/dataSource:DataLoader.
 * @library
 * @public
 * @deprecated Вместо него использовать Controls-DataEnv/dataLoader:Loader
 */
export {
    default as DataLoader,
    TLoadersConfigsMap as TLoadConfig,
    TLoadResultMap,
} from './_dataSourceOld/DataLoader';
export { IDataLoaderOptions } from 'Controls/_dataSourceOld/DataLoader';
export { ILoadDataConfig } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataConfig';
export { ILoadDataResult } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataResult';
export { ILoadDataCustomConfig } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataCustomConfig';
