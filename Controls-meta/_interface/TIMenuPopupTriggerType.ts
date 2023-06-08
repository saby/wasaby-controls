import { StringType } from 'Types/meta';

const options = ['click', 'hover'] as const;

export const TIMenuPopupTriggerType = StringType.id(
    'Controls/meta:TIMenuPopupTriggerType'
)
    .oneOf(options)
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ StringEnumEditor }) => {
                    return StringEnumEditor;
                }
            );
        },
        { options }
    );
