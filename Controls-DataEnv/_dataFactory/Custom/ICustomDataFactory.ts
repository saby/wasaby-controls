import { IBaseDataFactoryArguments } from '../interface/IBaseDataFactoryArguments';
import { IDataFactory } from '../interface/IDataFactory';

/**
 * Интерфейс Custom фабрики данных для совместимости со старой реализацией предзагрузки.
 * @public
 */
export interface ICustomDataFactoryArguments extends IBaseDataFactoryArguments {
    /**
     *
     */
    loadDataMethod: Function;
    /**
     *
     */
    loadDataMethodArguments: unknown;
    /**
     *
     */
    dependencies?: string[];
}

/**
 *
 */
export type ICustomDataFactory = IDataFactory<unknown, ICustomDataFactoryArguments>;
