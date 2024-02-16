import { ObjectType, StringType, UnknownType } from 'Meta/types';
import { IActionOptions } from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export const IActionTypeMeta = ObjectType.id('Controls-Input-meta/interface:IActionTypeMeta')
    .attributes<IActionOptions>({
        id: StringType,
        actionProps: UnknownType,
    })
    .title(translate('Действие'))
    .editor(() => {
        return import('Controls-Buttons-editors/ActionEditor').then(({ ActionEditor }) => {
            return ActionEditor;
        });
    })
    .optional();
