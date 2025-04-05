import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILabelOptions {
    label: TOuterIconLabel | TOuterTextLabel;
}

export const ILabelOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILabelOptionsType'
)
    .properties<ILabelOptions>({
        label: ObjectType.properties<TOuterIconLabel | TOuterTextLabel>({
            label: StringType,
            labelPosition: StringType.oneOf(['top', 'start']),
            icon: StringType,
        })
            .title(translate('Метка'))
            .editor('Controls-Input-editors/LabelEditor:LabelEditor', {
                isJumping: false,
                titlePosition: 'none',
            })
            .optional()
            .order(1)
            .defaultValue({}),
    })
    .defaultValue({});
