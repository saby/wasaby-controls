import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

interface IDataObjectType {
    /**
     * Идентификатор типа в сервисе типов
     * @example {guid}
     */
    Id: string;
    /**
     * Название прикладного объекта
     * @example TestApplicationObject
     */
    TypeId: string;
    /**
     * Мета-тип прикладного объекта
     * @example "applicationobject",
     */
    MetaType: string;
    /**
     * Версия прикладного объекта
     * @example "24.3100"
     */
    Version: string;

    /**
     * Свойства прикладного объекта
     */
    Properties: RecordSet<IDataObjectPropertyType, Model<IDataObjectPropertyType>>;
}

interface IDataObjectPropertyType {
    /**
     * Идентификатор типа поля в сервисе типов
     * @example {guid}
     */
    Id: string;
    /**
     * Название поля прикладного объекта
     * @example Author
     */
    Name: string;
    /**
     * Тип поля прикладного объекта
     * @example String
     */
    Type: 'DateTime';
    /**
     * Мета-тип поля прикладного объекта
     * @example 'primitive'
     */
    MetaType: string;
    /**
     * Массив
     */
    IsArray: false;

    MetaAttributes: RecordSet<IDataObjectPropertyMetaAttribute>;
}

interface IDataObjectPropertyMetaAttribute<T extends object = any> {
    Name: string;
    Type: string;
    Value: Model<T>;
}

/**
 * Интерфейс описания типа аргумента функции
 */
interface IDataObjectArgumentType {
    /**
     * Название аргумента
     */
    name: string;
    /**
     * Тип аргумента
     */
    type:
        | 'Integer'
        | 'Boolean'
        | 'Float'
        | 'Double'
        | 'String'
        | 'Date'
        | 'Decimal'
        | 'UUID'
        | 'Period';
    /**
     * Текстовое описание аргумента
     */
    description: string;
    is_array: boolean;
    is_required: boolean;
}

type TArgumentsModelType = Model<
    IDataObjectPropertyMetaAttribute<{ value: IDataObjectArgumentType[] }>
>;

/**
 * Интерфейс описания возвращаемого объекта
 */
interface IReturnValueDescription {
    fields: IReturnValueFieldDescription[];
    is_array: boolean;
    kind: string;
}

/**
 * Интерфейс описания поля в возвращаемом объекте
 */
interface IReturnValueFieldDescription {
    description: string;
    is_array: boolean;
    kind: string;
    name: string;
    type: string;
}

type TReturnValueModelType = Model<IDataObjectPropertyMetaAttribute<IReturnValueDescription>>;

export {
    IDataObjectType,
    IDataObjectPropertyMetaAttribute,
    IDataObjectArgumentType,
    IDataObjectPropertyType,
    TArgumentsModelType,
    TReturnValueModelType,
    IReturnValueFieldDescription,
};
