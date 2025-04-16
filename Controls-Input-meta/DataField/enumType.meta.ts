import { ObjectType, StringType } from 'Meta/types';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import ComboboxConnectedType from 'Controls-Input-meta/ComboboxConnectedType';

const enumType = ObjectType.id('Controls-Input/DataField/enumType')
    .title('Перечисляемое')
    .description('Редактор типа "перечисляемое"')
    .icon('icon-ExpandList')
    .properties({
        ...DataField.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/ComboboxConnectedType'),
            componentProps: ObjectType.properties({
                ...ComboboxConnectedType.properties(),
            }),
        }),
    });

export default enumType;
