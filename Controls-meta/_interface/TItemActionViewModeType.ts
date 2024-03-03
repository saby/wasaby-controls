import { StringType } from 'Meta/types';
import { TItemActionViewMode } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TItemActionViewMode[] = ['link', 'filled'] as const;

export const TItemActionViewModeType = StringType.id('Controls/meta:TItemActionViewModeType')
    .oneOf(options)
    .title(rk('Допустимые значения для опции viewMode.'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
