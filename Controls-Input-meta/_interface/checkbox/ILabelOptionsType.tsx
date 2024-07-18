import { TCaptionLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILabelOptions {
    label: TCaptionLabel | TOuterTextLabel;
}

export const ILabelOptionsType = ObjectType.id(
    'Controls-Input-meta/checkboxConnected:ILabelOptionsType'
)
    .attributes<ILabelOptions>({
        label: ObjectType.attributes<TCaptionLabel | TOuterTextLabel>({
            label: StringType,
            labelPosition: StringType.oneOf(['top', 'start']),
        })
            .title(translate('Метка'))
            .editor('Controls-Input-editors/CaptionLabelEditor:CaptionLabelEditor', {
                isJumping: false,
                defaultValue: {
                    label: translate('Метка'),
                },
            })
            .optional()
            .defaultValue({
                label: translate('Метка'),
                labelPosition: 'captionEnd',
            }),
    })
    .defaultValue({
        label: {
            label: translate('Метка'),
            labelPosition: 'captionEnd',
        },
    });
