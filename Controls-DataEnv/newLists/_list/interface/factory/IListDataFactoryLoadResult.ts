import type { IAbstractListDataFactoryLoadResult } from 'Controls-DataEnv/abstractList';
import { ISourceOptions, TFilter, TKey } from 'Controls-DataEnv/interface';
import { INavigationOptions, INavigationSourceConfig } from 'Controls-DataEnv/listTypes';
import type { RecordSet } from 'Types/collection';

import type { ControllerClass as OperationsController } from 'Controls/operations';
import type { ErrorViewConfig } from 'ErrorHandling/interface';
import type { ErrorController } from 'Controls/error';
import type { NewSourceController } from 'Controls/dataSource';

/**
 * Интерфейс результата загрузки фабрики данных WEB списка.
 */
export interface IListDataFactoryLoadResult
    extends IAbstractListDataFactoryLoadResult,
        ISourceOptions,
        INavigationOptions<INavigationSourceConfig> {
    type?: string;
    items: RecordSet;
    expandedItems?: TKey[];
    collapsedGroups?: (string | number)[];
    storedColumnsWidths?: Record<string, string>;
    filter: TFilter;
    root?: TKey;
    data?: RecordSet;
    error?: Error;
    errorViewConfig?: ErrorViewConfig;
    operationsController?: OperationsController;
    /**
     * Компонент для обработки ошибки.
     * Данную опцию следует определять, если нужно изменить способ отображения ошибки (диалог, вместо контента или во всю страницу) или добавить свои обработчики ошибок.
     */
    errorController?: ErrorController;
    sourceController?: NewSourceController;
    loading?: boolean;
    markedKey?: TKey;
}
