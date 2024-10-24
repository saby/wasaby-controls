import { IRouter } from 'Router/router';
import type { IDataConfigLoader, TDataConfigs } from 'Controls-DataEnv/dataFactory';
import DataConfigsLoader from './DataConfigsLoader';
import DataContextLoader, { ILoadedDataConfigsResult } from './DataContextLoader';
/**
 * Класс загрузчика данных.
 * @public
 */
export default class DataLoader {
    /**
     * Метод загрузки данных
     * @param configs Набор фабрик данных
     * @param loadTimeout - общий таймаут для загрузки данных
     * @param Router - Роутер.
     */
    static async load(
        configs: TDataConfigs,
        loadTimeout?: number | undefined,
        Router?: IRouter
    ): Promise<Record<keyof TDataConfigs, unknown>> {
        return new DataConfigsLoader({
            configs,
            router: Router,
            loadTimeout,
        }).load();
    }

    /**
     * Метод, который возвращает результирующие промисы метода загрузки каждой фабрики данных, не дожидаясь их завершения.
     * @param configs Набор фабрик данных
     * @param loadTimeout - общий таймаут для загрузки данных
     * @param Router - Роутер.
     */
    static loadEvery(
        configs: TDataConfigs,
        loadTimeout: number | null,
        Router: IRouter
    ): Record<string, Promise<unknown>> {
        return new DataConfigsLoader({
            configs,
            router: Router,
            loadTimeout,
        }).loadEvery();
    }

    /**
     * Метод загрузки данных по модулям, которые экспортируют метод getConfig.
     * @param configGetters Набор фабрик данных
     * @param loadTimeout - общий таймаут для загрузки данных
     * @param Router - Роутер.
     * @param returnsDataConfigs - Флаг для получения конфигураций фабрик из геттеров (ВАЖНО: конфигурация фабрик данных чаще всего не сериализуется)
     */
    static async loadByConfigs(
        configGetters: Record<string, IDataConfigLoader>,
        loadTimeout?: number | undefined,
        Router?: IRouter,
        returnsDataConfigs?: boolean
    ): Promise<ILoadedDataConfigsResult> {
        return new DataContextLoader({
            //@ts-ignore;
            configs: {},
            router: Router,
            loadTimeout,
        }).loadCompatible(configGetters, returnsDataConfigs);
    }
}
