import { StringType } from 'Meta/types';
import { TActionDisplayMode } from 'Controls/interface';

const options: readonly TActionDisplayMode[] = [
    TActionDisplayMode.TITLE,
    TActionDisplayMode.ICON,
    TActionDisplayMode.BOTH,
    TActionDisplayMode.AUTO,
] as const;

export const TActionDisplayModeType = StringType.id('Controls/meta:TActionDisplayModeType')
    .oneOf(options)
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
