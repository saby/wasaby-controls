import { ObjectType, StringType } from 'Meta/types';
import { IDefaultTimeValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import dateConnectedTimeType from 'Controls-Input-meta/dateConnectedTimeType';

const inputTimeType = ObjectType.id('Controls-Input/DataField/inputTimeType')
    .title('Время')
    .description('Редактор типа "время"')
    .icon('icon-TimeSkinny')
    .properties({
        ...DataField.properties(),
        ...IDefaultTimeValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/dateConnected:Time'),
            componentProps: ObjectType.properties({
                ...dateConnectedTimeType.properties(),
            }),
        }),
    });

export default inputTimeType;
