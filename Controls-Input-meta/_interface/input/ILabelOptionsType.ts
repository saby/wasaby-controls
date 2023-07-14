import { TInnerLabel, TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType, BooleanType } from 'Types/meta';
import * as translate from 'i18n!Controls';

export const ILabelOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:ILabelOptionsType')
    .attributes<TOuterIconLabel | TOuterTextLabel | TInnerLabel>({
        label: StringType,
        labelPosition: StringType.oneOf(['top', 'start']),
        icon: StringType,
        jumping: BooleanType
    })
    .title(translate('Метка'))
    .editor(() => {
        return import('Controls-editors/properties').then(({LabelEditor}) => {
            return LabelEditor;
        });
    })
    .optional();
