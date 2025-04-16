import {
    IListDataFactoryLoadResult as ICleanListDataFactoryLoadResult,
    IListState,
} from 'Controls-DataEnv/list';

/**
 * Интерфейс результата загрузки фабрики данных WEB списка.
 */
export interface IListDataFactoryLoadResult extends ICleanListDataFactoryLoadResult {
    /**
     * @deprecated Отправка колонок с сервера на клиент запрещена, поддержка в скором времени будет удалена.
     */
    header: IListState['header'];

    /**
     * @deprecated Отправка колонок с сервера на клиент запрещена, поддержка в скором времени будет удалена.
     */
    columns: IListState['columns'];
}
