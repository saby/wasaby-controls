import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const INoJumpingLabelOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:INoJumpingLabelOptionsType'
)
    .attributes({
        label: ObjectType.title(translate('Метка'))
            .attributes<TOuterIconLabel | TOuterTextLabel>({
                label: StringType,
                labelPosition: StringType.oneOf(['top', 'start']),
                icon: StringType,
            })
            .editor('Controls-Input-editors/LabelEditor:LabelEditor', { isJumping: false })
            .optional()
            .defaultValue({}),
    })
    .defaultValue({});
