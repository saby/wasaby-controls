import * as rk from 'i18n!Controls';
import { StringType } from 'Meta/types';
import { TFontWeight } from 'Controls/interface';

const options: readonly TFontWeight[] = ['default', 'normal', 'bold'] as const;

export const TFontWeightType = StringType.oneOf(options)
    .id('Controls/meta:TFontWeightType')
    .title(rk('Толщина шрифта'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
