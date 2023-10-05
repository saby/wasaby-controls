import { StringType } from 'Types/meta';
import { TItemActionsSize } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TItemActionsSize[] = ['s', 'm'] as const;

export const TItemActionsSizeType = StringType.id('Controls/meta:TItemActionsSizeType')
    .oneOf(options)
    .title(rk('Размер иконок опций записи.'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
