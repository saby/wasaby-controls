import { StringType } from 'Meta/types';
import { TNavigationTotalInfo } from 'Controls/interface';

const options: readonly TNavigationTotalInfo[] = ['basic', 'extended'] as const;

export const TNavigationTotalInfoType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationTotalInfoType')
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
