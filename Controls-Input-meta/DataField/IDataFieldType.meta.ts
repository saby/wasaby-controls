import { ObjectType, StringType, group, extended } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export interface IDataField {
    name?: string;
    local?: string;
    title?: string;
    description?: string;
}

const titleType = ObjectType.id('Controls-Input/DataField:TitleType')
    .properties({
        title: StringType.required().order(0),
        labelFontColorStyle: StringType.optional(),
    })
    .editor('Controls-Input-editors/dataFieldEditor:LabelEditor', {
        titlePosition: 'none',
        placeholder: translate('Имя поля'),
        shortPlaceholder: translate('имя'),
    })
    .required()
    .order(0);

const dataField = ObjectType.id('Controls-Input/DataField:DataField')
    .description('Редактор Доп. полей')
    .icon('icon-Rename')
    .properties<IDataField>({
        ...titleType.properties(),
        local: StringType.required()
            .editor('Controls-editors/input:TextEditor', {
                titlePosition: 'none',
                placeholder: translate('Переменная'),
                shortPlaceholder: translate('переменная'),
            })
            .order(2),
        name: StringType.optional()
            .editor('Controls-editors/input:TextEditor', {
                titlePosition: 'none',
                placeholder: translate('Подсказка'),
                shortPlaceholder: translate('подсказка'),
            })
            .order(3),
        ...extended({
            ...group(translate('Описание'), {
                description: StringType.optional().editor('Controls-editors/input:AreaEditor', {
                    titlePosition: 'none',
                    placeholder: translate('Введите текст, который будет виден в окне подсказки'),
                }),
            }),
        }),
        ...extended({
            ...group(translate('Условия видимости'), {
                visibilityCondition: StringType.optional().editor(
                    'Controls-editors/input:AreaEditor',
                    {
                        titlePosition: 'none',
                        placeholder: translate('Если формула вернет true, то поле появится'),
                    }
                ),
            }),
        }),
        ...extended({
            ...group(translate('Валидация'), {
                validator: StringType.optional().editor('Controls-editors/input:AreaEditor', {
                    titlePosition: 'none',
                    placeholder: translate('Проверка заполнения данных поможет исключить ошибки'),
                }),
            }),
        }),
    });

export default dataField;
