import { IDataObjectArgumentType } from '../dataTypes';
import { Meta } from 'Meta/types';
import { BalanceArgsType, isBalanceArgsType } from './metaTypes/balanceType';

/**
 * Генерируем мета-тип объекта аргументов с проставленными редакторами
 * FIXME: готовый мета-тип должен приходить с БЛ https://dev.sbis.ru/opendoc.html?guid=16c1cb3a-7d26-41d0-bb7c-83a75a70854b&client=3
 * @param fields
 */
export function buildRecordTypeMeta(
    fields: IDataObjectArgumentType[] = []
): Meta<unknown> | undefined {
    if (!fields.length) {
        return;
    }

    // пытаемся определить тип рекорда по косвенным признакам
    if (isBalanceArgsType(fields)) {
        return BalanceArgsType as Meta<unknown>;
    }
}
