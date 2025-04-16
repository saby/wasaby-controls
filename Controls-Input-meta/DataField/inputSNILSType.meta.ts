import { ObjectType, StringType } from 'Meta/types';
import { IDefaultSNILSValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import extInputConnectedSNILSType from 'Controls-Input-meta/extInputConnectedSNILSType';

const inputSNILSType = ObjectType.id('Controls-Input/DataField/inputSNILSType')
    .title('SNILS')
    .description('Редактор типа "SNILS"')
    .icon('icon-TFLocalDrive')
    .properties({
        ...DataField.properties(),
        ...IDefaultSNILSValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/extInputConnected:SNILS'),
            componentProps: ObjectType.properties({
                ...extInputConnectedSNILSType.properties(),
            }),
        }),
    });

export default inputSNILSType;
