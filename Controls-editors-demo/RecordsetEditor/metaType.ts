import { ArrayType, BooleanType, ObjectType, StringType, VariantType } from 'Meta/types';

interface IMetaType {
    name: string;
    type: string;
    comment: string;
    unique: boolean;
}

const nestedItemType = ObjectType.properties({
    key: StringType.title('Ключ'),
    type: StringType.title('Тип'),
});

const nestedItemTypeDisable = ObjectType.properties({
    key: StringType.title('Ключ').disable(),
    type: StringType.title('Тип').disable(),
});

export const itemType = ObjectType.properties<IMetaType>({
    key: StringType.title('Ключ').required(),
    name: StringType.title('Название'),
    type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
        })
        .defaultValue('Auto')
        .title('Тип'),
    comment: StringType.title('Комментарий').optional(),
    unique: BooleanType.defaultValue(true).title('Уникальный').optional(),
    list: ArrayType.title('Поля').of(nestedItemType).id('TestType2'),
});

export const itemTypeDisable = ObjectType.properties<IMetaType>({
    key: StringType.title('Ключ').disable().required(),
    name: StringType.title('Название').disable(),
    type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
        })
        .defaultValue('Auto')
        .title('Тип')
        .disable(),
    comment: StringType.title('Комментарий').optional().disable(),
    unique: BooleanType.defaultValue(true).title('Уникальный').optional().disable(),
    list: ArrayType.title('Поля').of(nestedItemTypeDisable).id('TestType2').disable(),
});

const expressionType = ObjectType.properties({
    expression: StringType.title('Выражение').editor('CodeEditor/propertyGrid:CodeEditor'),
}).title('Expression');

const nameType = ObjectType.properties({
    fieldName: StringType.title('Имя поля'),
}).title('Field');

export const FieldType = VariantType.of({ name: nameType, expression: expressionType }).title(
    'Тип поля'
);

export const itemTypeWithVariants = ObjectType.properties<IMetaType>({
    key: StringType.title('Ключ').required(),
    name: StringType.title('Название'),
    type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
        })
        .defaultValue('Auto')
        .title('Тип'),
    comment: StringType.title('Комментарий').optional(),
    unique: BooleanType.defaultValue(true).title('Уникальный').optional(),
    fieldType: FieldType.optional(),
});

export const metaType = ArrayType.id('TestType').of(itemType).title('Колонки');

export const metaTypeDisable = ArrayType.id('TestType')
    .of(itemTypeDisable)
    .title('Колонки')
    .disable();

export const metaTypeWithVariants = ArrayType.id('TestType')
    .of(itemTypeWithVariants)
    .title('Колонки');
