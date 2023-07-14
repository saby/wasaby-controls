import { ObjectType, StringType, UnknownType } from 'Types/meta';
import { IActionOptions } from 'Controls-Buttons/interface';
import * as translate from 'i18n!Controls';

export const IActionTypeMeta = ObjectType.id('Controls-Buttons-meta/interface:IActionTypeMeta')
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
