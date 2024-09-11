import { StringType, ArrayType, ObjectType } from 'Meta/types';
import rk = require('i18n!Controls');
import { INameOptionsType } from './INameOptionsType';

interface ITableChooser {
    name: string;
    columns: string[];
}

export const IColumnSelectorType = ArrayType.of(StringType)
    .title(rk('Выбор колонок'))
    .description(rk('Выбор колонок Автотаблицы'));

export const ITableOptionsType = ObjectType.properties<ITableChooser>({
    name: INameOptionsType,
    columns: IColumnSelectorType.defaultValue([]),
})
    .title('')
    .editor('Controls-Input-editors/tableEditor:TableEditor');
