import { ArrayType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-editors';

/*
 * Тип "СчетУчета"
 */
type TBookkeepingAccount = string[];

/**
 * Мета-тип "СчетУчета"
 */
const BookkeepingAccountType = ArrayType.id('ArgumentsEditor/fakeTypes:BookkeepingAccountType')
    .of(StringType)
    .title(translate('Cчет учета'))
    .editor('Controls-editors/function:BookkeepingAccountEditor');

export { TBookkeepingAccount, BookkeepingAccountType };
