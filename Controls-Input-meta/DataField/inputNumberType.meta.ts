import { ObjectType, StringType } from 'Meta/types';
import { IDefaultInputValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import inputConnectedNumberType from 'Controls-Input-meta/inputConnectedNumberType';

const inputNumberType = ObjectType.id('Controls-Input/DataField/inputNumberType')
    .title('Число')
    .description('Редактор типа "число"')
    .icon('icon-Number')
    .properties({
        ...DataField.properties(),
        ...IDefaultInputValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/inputConnected:Number'),
            componentProps: ObjectType.properties({
                ...inputConnectedNumberType.properties(),
            }),
        }),
    });

export default inputNumberType;
