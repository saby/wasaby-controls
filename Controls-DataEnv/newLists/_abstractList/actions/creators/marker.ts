import type { TKey } from 'Controls-DataEnv/interface';
import type { marker } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия для отметки записи маркером.
 */
export const mark = (key: TKey | undefined): marker.TMarkAction =>
    aCreator('mark', {
        key,
    });

/**
 * Конструктор действия для установки нового MarkedKey
 */
export const setMarkedKey = (key: TKey | undefined): marker.TSetMarkedKeyAction =>
    aCreator('setMarkedKey', {
        key,
    });
