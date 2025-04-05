import { ObjectType, StringType } from 'Meta/types';
import { IDefaultValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import inputConnectedMaskType from 'Controls-Input-meta/inputConnectedMaskType';

const inputMaskType = ObjectType.id('Controls-Input/DataField/inputMaskType')
    .title('Маска')
    .description('Редактор типа "маска"')
    .icon('icon-TFLocalDrive')
    .properties({
        ...DataField.properties(),
        ...IDefaultValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/inputConnected:Mask'),
            componentProps: ObjectType.properties({
                ...inputConnectedMaskType.properties(),
            }),
        }),
    });

export default inputMaskType;
