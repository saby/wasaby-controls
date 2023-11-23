import { StringType, ArrayType, ObjectType } from 'Types/meta';
import rk = require('i18n!Controls');
import { INameOptionsType } from './INameOptionsType';

interface ITableChooser {
    name: string;
    columns: string[];
}

export const IColumnSelectorType = ArrayType.of(StringType)
    .title(rk('Выбор колонок'))
    .description(rk('Выбор колонок Автотаблицы'));

export const ITableOptionsType = ObjectType.attributes<ITableChooser>({
    name: INameOptionsType,
    columns: IColumnSelectorType.defaultValue([]),
})
    .title('')
    .editor(() => {
        return import('Controls-Input-editors/tableEditor').then(({ TableEditor }) => {
            return TableEditor;
        });
    });
