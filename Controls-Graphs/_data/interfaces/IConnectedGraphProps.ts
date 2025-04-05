import { IStoreId } from './IStoreId';
import { IName } from './IName';
import { IHasDataCallback } from './IHasDataCallback';

/**
 * @public
 * @interface Controls-Graphs/_data/interfaces/IConnectedGraphProps
 * @implements Controls-Graphs/_data/interfaces/IStoreId
 * @implements Controls-Graphs/_data/interfaces/IName
 * @implements Controls-Graphs/_data/interfaces/IHasDataCallback
 * Интерфейс, описывающий общие опции для connected графиков(связанных с контекстом).
 */
export interface IConnectedGraphProps extends IStoreId, IName, IHasDataCallback {}
