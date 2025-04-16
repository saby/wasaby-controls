import { IBaseColumnConfig, IColumnConfig } from 'Controls-DataEnv/listTypes';

/**
 * Состояние для поддержки разделения записей на колонки
 */
export interface IColumnsState {
    /**
     * Конфигурация ячеек заголовков
     */
    header?: IBaseColumnConfig[];

    /**
     * Конфигурация ячеек данных
     */
    columns?: IColumnConfig[];
}
