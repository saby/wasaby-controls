import { ObjectType, StringType } from 'Meta/types';
import { IDefaultValueOptionsType } from 'Controls-Name-meta/interface';
// @ts-ignore
import DataField from 'Controls-Input-meta/DataField/IDataFieldType';
// @ts-ignore
import inputConnectedInputType from 'Controls-Name-meta/inputConnectedInputType';

const inputNameType = ObjectType.id('Controls-Name/DataField/inputNameType')
    .title('ФИО')
    .description('Редактор типа "ФИО"')
    .icon('icon-Client2')
    .properties({
        ...DataField.properties(),
        ...IDefaultValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Name/inputConnected:Input'),
            componentProps: ObjectType.properties({
                ...inputConnectedInputType.properties(),
            }),
        }),
    });

export default inputNameType;
