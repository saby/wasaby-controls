import { ObjectType, StringType } from 'Meta/types';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import CheckboxGroupConnectedType from 'Controls-Input-meta/CheckboxGroupConnectedType';

const checkboxGroupType = ObjectType.id('Controls-Input/DataField/checkboxGroupType')
    .title('Группа флагов')
    .description('Редактор типа "группа флагов"')
    .icon('icon-Check2')
    .properties({
        ...DataField.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/CheckboxGroupConnectedType'),
            componentProps: ObjectType.properties({
                ...CheckboxGroupConnectedType.properties(),
            }),
        }),
    });

export default checkboxGroupType;
