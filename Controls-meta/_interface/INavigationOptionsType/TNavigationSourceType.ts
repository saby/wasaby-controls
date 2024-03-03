import { StringType } from 'Meta/types';
import * as rk from 'i18n!Controls';
import { TNavigationSource } from 'Controls/interface';

const options: readonly TNavigationSource[] = ['position', 'page'] as const;

export const TNavigationSourceType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationSourceType')
    .title(rk('Режим работы с источником данных'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
