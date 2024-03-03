import { StringType } from 'Meta/types';
import { TItemAlign } from 'Controls/menu';
import * as rk from 'i18n!Controls';

const options: readonly TItemAlign[] = ['left', 'right'] as const;

export const TAlignItemType = StringType.id('Controls/meta:TAlignItemType')
    .oneOf(options)
    .title(rk('Позиционирование по горизонтали'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
