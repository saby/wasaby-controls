import { ObjectType, StringType } from 'Meta/types';
import { IDefaultPhoneValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import inputConnectedPhoneType from 'Controls-Input-meta/inputConnectedPhoneType';

const inputPhoneType = ObjectType.id('Controls-Input/DataField/inputPhoneType')
    .title('Телефон')
    .description('Редактор типа "телефон"')
    .icon('icon-PhoneNull')
    .properties({
        ...DataField.properties(),
        ...IDefaultPhoneValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/inputConnected:Phone'),
            componentProps: ObjectType.properties({
                ...inputConnectedPhoneType.properties(),
            }),
        }),
    });

export default inputPhoneType;
