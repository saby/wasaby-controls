import {IRowProps as IGridRowProps, TGetRowPropsCallback as TGetBaseRowPropsCallback} from 'Controls/gridRender';
import { IBaseExpanderProps } from 'Controls/treeRender';

/**
 * Опции для настройки строки иерархической таблицы, возвращаемые из коллбека {@link Controls/treeGrid/View/Property/getRowProps getRowProps}
 * @public
 */
export interface IRowProps extends IGridRowProps, IBaseExpanderProps {}

/**
 * Тип для функции, возвращающей конфигурацию строки иерархической таблицы,
 * Принимает аргумент item: {@link Types/entity:Model} и возвращает {@link Controls/treeGridRender/IRowProps}
 * @typedef TGetRowPropsCallback
 */
export type TGetRowPropsCallback = TGetBaseRowPropsCallback<IRowProps>;
