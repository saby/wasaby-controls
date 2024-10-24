import type { Record } from 'Types/entity';
import { ObjectAdapter } from './ObjectAdapter';
import { RecordAdapter } from 'Controls-editors/propertyGrid';
import { Meta } from 'Meta/types';

/*
 * Интерфейс адаптера значений для Controls-editors/propertyGridConnected:PropertyGrid
 */
export interface IAdapter<T = object> {
    /*
     * Преобразует объект значения PropertyGrid в свой тип
     */
    set(val: T): void;

    /*
     * Преобразует свой тип в объект значения PropertyGrid
     */
    get(): T;
}

/*
 * Создает адаптер для работы Controls-editors/propertyGridConnected:PropertyGrid с любыми типами значений
 * @param bindingValue значение, для которого строим конвертер
 */
export function createAdapter(bindingValue: unknown, metaType?: Meta<object>): IAdapter {
    if (!bindingValue) {
        return new ObjectAdapter(bindingValue as null);
    }

    if (typeof bindingValue === 'object' && bindingValue['[Types/_entity/Record]']) {
        return new RecordAdapter(bindingValue as Record, metaType);
    }

    return new ObjectAdapter(bindingValue as object);
}
