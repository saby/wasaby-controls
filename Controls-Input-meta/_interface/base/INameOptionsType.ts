import * as rk from 'i18n!Controls-Input';
import { ArrayType, StringType } from 'Meta/types';

/*
 * Типы полей БЛ карт данных
 */
export enum FieldTypes {
    String = 'string',
    Text = 'text',
    Boolean = 'bool',
    Integer = 'int',
    Real = 'float',
    Email = 'email',
    Money = 'money',
    Image = 'image',
    Print = 'print',
    Link = 'link',
    List = 'list',
    Date = 'date',
    Time = 'time',
    DateTime = 'datetime',
    Array = 'array',
    File = 'file',
}

export const INameOptionsType = ArrayType.of(StringType)
    .id('Controls-Input-meta/inputConnected:INameOptionsType')
    .title('')
    .description(rk('Название поля'))
    .editor('Controls-editors/properties:ConnectedNameEditor')
    .defaultValue(null)
    .optional();
