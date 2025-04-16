import { ObjectType, StringType } from 'Meta/types';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import CheckboxGroupConnectedType from 'Controls-Input-meta/CheckboxGroupConnectedType';

const flagsType = ObjectType.id('Controls-Input/DataField/flagsType')
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

export default flagsType;
