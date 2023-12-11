import { TCaptionLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

export const ILabelOptionsType = ObjectType.id(
    'Controls-Input-meta/checkboxConnected:ILabelOptionsType'
)
    .attributes<TCaptionLabel | TOuterTextLabel>({
        label: StringType,
        labelPosition: StringType.oneOf(['top', 'start'])
    })
    .title(translate('Метка'))
    .editor(
        () => {
            return import('Controls-Input-editors/CaptionLabelEditor').then(({ CaptionLabelEditor }) => {
                return CaptionLabelEditor;
            });
        },
        {
            isJumping: false,
            defaultValue: {
                label: translate('Метка'),
            },
        }
    )
    .optional()
    .defaultValue({});
