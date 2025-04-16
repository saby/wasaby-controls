import { ObjectType, StringType } from 'Meta/types';
import { IDateDefaultValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import dateConnectedDateType from 'Controls-Input-meta/dateConnectedDateType';

const inputDateType = ObjectType.id('Controls-Input/DataField/inputDateType')
    .title('Дата')
    .description('Редактор типа "дата"')
    .icon('icon-Calendar')
    .properties({
        ...DataField.properties(),
        ...IDateDefaultValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/dateConnected:Date'),
            componentProps: ObjectType.properties({
                ...dateConnectedDateType.properties(),
            }),
        }),
    });

export default inputDateType;
