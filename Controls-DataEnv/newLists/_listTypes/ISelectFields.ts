import { QuerySelectExpression } from 'Types/source';

/**
 * Параметры конфигурации для контролов, поддерживающих выборку по именам полей.
 * */
export interface ISelectFieldsOptions {
    selectFields?: QuerySelectExpression;
}
