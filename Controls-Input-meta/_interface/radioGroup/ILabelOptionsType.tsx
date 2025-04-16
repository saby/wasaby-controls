import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const ILabelOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILabelOptionsType'
)
    .properties({
        label: ObjectType.title(translate('Метка'))
            .properties<TOuterIconLabel | TOuterTextLabel>({
                label: StringType,
                labelPosition: StringType.oneOf(['top', 'start']),
                icon: StringType,
            })
            .editor('Controls-Input-editors/LabelEditor:LabelEditor', {
                isJumping: false,
            })
            .optional()
            .order(1)
            .defaultValue({}),
    })
    .defaultValue({});
