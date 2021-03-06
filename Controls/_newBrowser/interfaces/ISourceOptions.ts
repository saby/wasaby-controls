import {ICrudPlus, QueryWhereExpression} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {TKey} from 'Controls/_interface/IItems';

/**
 * Интерфейс описывает структуру данных, которая представляет из себя настройки
 * с помощью которых источник данных будет вычитывать данные
 */
export interface ISourceOptions {
    /**
     * Источник данных через который будут выполняться все запросы к даннам.
     */
    source?: ICrudPlus;

    /**
     * Имя поля записи, содержащее идентификатор записи, полученной
     * с помощью {@link source}.
     */
    keyProperty?: string;

    /**
     * Имя поля записи, содержащее информацию о типе записи
     * (лист, узел, скрытый узел), полученной с помощью {@link source}.
     */
    nodeProperty?: string;

    /**
     * Имя поля записи, содержащее идентификатор родительской записи.
     */
    parentProperty?: string;

    /**
     * Имя поля записи, содержимое которого будет отображаться.
     */
    displayProperty?: string;

    /**
     * Имя поля записи полученной с помощью {@link source} и содержащее
     * информацию о наличии дочерних элементов.
     */
    hasChildrenProperty?: string;

    /**
     * Иденитфикатор корневого узла
     */
    root?: TKey;

    /**
     * Данные фильтра, который будет применен при запросе данных
     */
    filter?: QueryWhereExpression<unknown>;

    columns?: unknown;

    dataLoadCallback?: (items: RecordSet, direction: string) => void;
}
