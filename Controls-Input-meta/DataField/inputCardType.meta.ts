import { group, ObjectType, StringType } from 'Meta/types';
import { IDefaultCardValueOptionsType, IRequiredOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';

import * as translate from 'i18n!Controls-Input';

const inputCardType = ObjectType.id('Controls-Input/DataField/inputCardType')
    .title('Маска')
    .description('Редактор типа "маска"')
    .icon('icon-TFLocalDrive')
    .properties({
        ...DataField.properties(),
        ...IDefaultCardValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/inputConnected:Mask'),
            componentProps: ObjectType.properties({
                ...group(translate('Ограничения'), '', {
                    ...IRequiredOptionsType.properties(),
                }),
            }),
        }),
    });

export default inputCardType;
