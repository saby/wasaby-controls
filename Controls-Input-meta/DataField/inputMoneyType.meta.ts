import { ObjectType, StringType } from 'Meta/types';
import { IDefaultInputValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import inputConnectedMoneyType from 'Controls-Input-meta/inputConnectedMoneyType';

const inputNumberType = ObjectType.id('Controls-Input/DataField/inputNumberType')
    .title('Деньги')
    .description('Редактор типа "деньги"')
    .icon('icon-Money')
    .properties({
        ...DataField.properties(),
        ...IDefaultInputValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/inputConnected:Money'),
            componentProps: ObjectType.properties({
                ...inputConnectedMoneyType.properties(),
            }),
        }),
    });

export default inputNumberType;
