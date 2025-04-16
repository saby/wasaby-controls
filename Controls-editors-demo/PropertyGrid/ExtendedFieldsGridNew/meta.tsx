import { WidgetType, StringType, group } from 'Meta/types';

interface IExtendedFieldsExampleMetaAttrs {
    exampleField1: string;
    exampleField2: string;
    exampleField3: string;
    exampleField4: string;
    exampleField5: string;
}

export const ExtendedFieldsExampleMeta = WidgetType.id('Controls-editors-demo/ExtendedFieldsGrid')
    .title('Пример меты с раширенными полями')
    .properties<IExtendedFieldsExampleMetaAttrs>({
        ...group('Группа 1', {
            exampleField1: StringType.title('Пример поля 1'),
            exampleField3: StringType.title('Пример поля 3').extended().icon('icon-AddCaption'),
            exampleField5: StringType.title('Пример поля 5').extended().icon('icon-AddCaption'),
            exampleField6: StringType.title('Пример поля 6').extended().icon('icon-AddCaption'),
            exampleField7: StringType.title('Пример поля 7').extended().icon('icon-AddCaption'),
            exampleField8: StringType.title('Пример поля 8').extended().icon('icon-AddCaption'),
            exampleField9: StringType.title('Пример поля 9').extended().icon('icon-AddCaption'),
            exampleField10: StringType.title('Пример поля 10').extended().icon('icon-AddCaption'),
        }),
        ...group('Группа 2', {
            exampleField2: StringType.title('Пример поля 2').extended().icon('icon-AddCaption'),
            exampleField4: StringType.title('Пример поля 4').extended().icon('icon-AddCaption'),
            exampleField5: StringType.title('Пример поля подлиннее').extended().icon('icon-Plus'),
        }),
    });
