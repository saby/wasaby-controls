import { IContextValue } from 'Controls/context';
import { Record } from 'Types/entity';

export interface IContextData extends IContextValue {
    documentContext?: Record;
}

/**
 * Получает объект из контекста
 * @public
 * @param context
 * @param objectName
 */
function findObject(context: IContextData, objectName: string): unknown {
    return context?.[objectName];
}

export { findObject };
