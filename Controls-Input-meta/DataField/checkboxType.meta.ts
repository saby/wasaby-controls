import { ObjectType, StringType } from 'Meta/types';
import { ICheckboxDefaultOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import CheckboxConnectedType from 'Controls-Input-meta/CheckboxConnectedType';

const checkboxType = ObjectType.id('Controls-Input/DataField/checkboxType')
    .title('Флаг')
    .description('Редактор типа "флаг"')
    .icon('icon-Check3')
    .properties({
        ...DataField.properties(),
        ...ICheckboxDefaultOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/CheckboxConnected'),
            componentProps: ObjectType.properties({
                ...CheckboxConnectedType.properties(),
            }),
        }),
    });

export default checkboxType;
