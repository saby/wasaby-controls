import { TInnerLabel, TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { BooleanType, ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const ILabelOptionsType = ObjectType
    .id('Controls-Input-meta/inputConnected:ILabelOptionsType')
    .attributes({
        label: ObjectType
            .title(translate('Метка'))
            .attributes<TOuterIconLabel | TOuterTextLabel | TInnerLabel>({
                label: StringType,
                labelPosition: StringType.oneOf(['top', 'start']),
                icon: StringType,
                jumping: BooleanType
            })
            .editor(() => {
                return import('Controls-Input-editors/LabelEditor').then(({LabelEditor}) => {
                    return LabelEditor;
                });
            })
            .optional()
            .defaultValue({})
    })
    .defaultValue({});
