import { ObjectType, StringType } from 'Meta/types';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import RadioGroupConnectedType from 'Controls-Input-meta/RadioGroupConnectedType';

const radioGroupType = ObjectType.id('Controls-Input/DataField/radioGroupType')
    .title('Группа флагов')
    .description('Редактор типа "группа флагов"')
    .icon('icon-Check2')
    .properties({
        ...DataField.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/RadioGroupConnectedType'),
            componentProps: ObjectType.properties({
                ...RadioGroupConnectedType.properties(),
            }),
        }),
    });

export default radioGroupType;
