import { CrudEntityKey } from 'Types/source';
import { TColumnKey as TBaseColumnKey } from 'Controls/gridReact';

export type TItemKey = CrudEntityKey;
export type TColumnKey = TBaseColumnKey;
export type TColumnKeys = TColumnKey[];

//TODO: отнести к timelineGrid.
/**
 * Тип кванта времени
 * @typedef {String} Controls-Lists/dynamicGrid/TQuantumType
 * @variant hour
 * @variant day
 * @variant month
 */
export type TQuantumType = 'second' | 'minute' | 'hour' | 'day' | 'month';

/**
 * Варинты для  плотности отображения данных.
 * От нее зависит, выравнивание контента в ячейке и наличие дней недели в заголовке
 * @typedef {String} Controls-Lists/dynamicGrid/TColumnDataDensity
 * @variant hour
 * @variant day
 * @variant month
 */
export type TColumnDataDensity = 'empty' | 'default' | 'advanced';
