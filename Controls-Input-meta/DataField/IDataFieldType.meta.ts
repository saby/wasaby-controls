import { ObjectType, StringType, group, extended } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export interface IDataField {
    name?: string;
    local?: string;
    title?: string;
    comment?: string;
}

const dataField = ObjectType.id('Controls-Input/DataField:DataField')
    .description('Редактор Доп. полей')
    .icon('icon-Rename')
    .properties<IDataField>({
        name: StringType.optional()
            .editor('Controls-editors/input:TextEditor', {
                titlePosition: 'none',
                placeholder: translate('Имя поля'),
                shortPlaceholder: translate('имя'),
            })
            .order(0),
        local: StringType.optional()
            .editor('Controls-editors/input:TextEditor', {
                titlePosition: 'none',
                placeholder: translate('Переменная'),
                shortPlaceholder: translate('переменная'),
            })
            .order(2),
        title: StringType.optional()
            .editor('Controls-editors/input:TextEditor', {
                titlePosition: 'none',
                placeholder: translate('Подсказка'),
                shortPlaceholder: translate('подсказка'),
            })
            .order(3),
        ...extended({
            ...group(translate('Описание'), {
                comment: StringType.optional().editor('Controls-editors/input:AreaEditor', {
                    titlePosition: 'none',
                    placeholder: translate('Введите текст, который будет виден в окне подсказки'),
                }),
            }),
        }),
    });

export default dataField;
