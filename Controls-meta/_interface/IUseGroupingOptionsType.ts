import * as rk from 'i18n!Controls';
import { BooleanType } from 'Types/meta';

export const IUseGroupingOptionsType = BooleanType.id(
    'Controls/meta:IUseGroupingOptionsType'
)
    .description(rk('Определяет, следует ли использовать разделители группы.'))
    .title('Разделители триад')
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ BooleanEditorCheckbox }) => {
                    return BooleanEditorCheckbox;
                }
            );
        },
        { title: ' ' }
    );
