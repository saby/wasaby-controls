import { WidgetType, StringType, group } from 'Types/meta';

interface IExtendedFieldsExampleMetaAttrs {
    exampleField1: string;
    exampleField2: string;
    exampleField3: string;
    exampleField4: string;
    exampleField5: string;
}

export const ExtendedFieldsExampleMeta = WidgetType.id('Controls-editors-demo/ExtendedFieldsGrid')
    .title('Пример меты с раширенными полями')
    .attributes<IExtendedFieldsExampleMetaAttrs>({
        ...group('Группа 1', {
            exampleField1: StringType.title('Пример поля 1'),
            exampleField3: StringType.title('Пример поля 3').extended('default'),
        }),
        ...group('Группа 2', {
            exampleField2: StringType.title('Пример поля 2'),
            exampleField4: StringType.title('Пример поля 4').extended('default'),
            exampleField5: StringType.title('Пример поля подлиннее').extended('default'),
        }),
    });
