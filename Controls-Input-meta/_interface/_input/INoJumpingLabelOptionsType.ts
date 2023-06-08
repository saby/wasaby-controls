import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Types/meta';
import * as translate from 'i18n!Controls';

export const INoJumpingLabelOptionsType = ObjectType
    .id('Controls-Input-meta/dateConnected:INoJumpingLabelOptionsType')
    .attributes<TOuterIconLabel | TOuterTextLabel>({
        label: StringType,
        labelPosition: StringType.oneOf(['top', 'start']),
        icon: StringType
    })
    .title(translate('Метка'))
    .editor(() => {
        return import('Controls-editors/properties').then(({LabelEditor}) => {
            return LabelEditor;
        });
    }, {isJumping: false})
    .optional();
