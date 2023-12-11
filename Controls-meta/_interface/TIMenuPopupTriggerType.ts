import { StringType } from 'Types/meta';

const options = ['click', 'hover'] as const;

export const TIMenuPopupTriggerType = StringType.id('Controls/meta:TIMenuPopupTriggerType')
    .oneOf(options)
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
