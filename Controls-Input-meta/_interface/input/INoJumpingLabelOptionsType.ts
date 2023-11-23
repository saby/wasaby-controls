import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

export const INoJumpingLabelOptionsType = ObjectType
    .id('Controls-Input-meta/dateConnected:INoJumpingLabelOptionsType')
    .attributes({
        label: ObjectType
            .title(translate('Метка'))
            .attributes<TOuterIconLabel | TOuterTextLabel>({
                label: StringType,
                labelPosition: StringType.oneOf(['top', 'start']),
                icon: StringType
            })
            .editor(() => {
                return import('Controls-Input-editors/LabelEditor').then(({LabelEditor}) => {
                    return LabelEditor;
                });
            }, {isJumping: false})
            .optional()
            .defaultValue({})
    })
    .defaultValue({});
