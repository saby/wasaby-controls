import * as rk from 'i18n!Controls-Input';
import { ArrayType, StringType, ObjectType, VariantType } from 'Meta/types';

const INameEntryType = StringType;
const INameType = ArrayType.of(INameEntryType).title('Привязка к полю');

/*
 * Типы полей БЛ карт данных
 */
export enum FieldTypes {
    String = 'string',
    Integer = 'integer',

    Double = 'double',
    Boolean = 'boolean',
    Money = 'money',
    Date = 'date',
    Time = 'time',
    DateTime = 'datetime',
    UUID = 'uuid',
    Enumerable = 'enum',
    Flags = 'flags',

    IntegerCompatible = 'int',
    BooleanCompatible = 'bool',
    StringCompatible = 'text',
    DoubleCompatible = 'float',

    Email = 'email',
    Image = 'image',
    Print = 'print',
    Link = 'link',
    List = 'list',
    Array = 'array',
    File = 'file',
    Function = 'Function',
}

/**
 * Метатип с перечислением типов полей прикладного объекта
 * @private
 */
const TFieldTypeName = StringType.oneOf(Object.values(FieldTypes));

/**
 * Метатип аргументов функции
 * @private
 */
const TFactoryArguments = ArrayType.of(VariantType.of([]));

const TFactory = ObjectType.properties({
    name: INameType,
    arguments: TFactoryArguments.optional(),
    result: INameType.optional(),
});

/**
 * Описание вызова функции на прикладном объекте
 * @private
 */
const IFunctionCallDescriptor = ObjectType.id(
    'Controls-Input-meta/inputConnected:IFunctionCallDescriptor'
)
    .title('Описание вызова функции')
    .properties({
        name: INameType,
        type: TFieldTypeName.optional(),
        factory: TFactory.optional(),
    });

/**
 * Тип поля привязки
 * @public
 */
export const INameOptionsType = ArrayType.of(
    VariantType.of([INameEntryType, IFunctionCallDescriptor])
)
    .id('Controls-Input-meta/inputConnected:INameOptionsType')
    .title('')
    .description(rk('Название поля'))
    .editor('Controls-editors/properties:ConnectedNameEditor')
    .defaultValue(null)
    .optional();
