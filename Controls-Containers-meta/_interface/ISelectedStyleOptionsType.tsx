import { ObjectType, EnumType, StringType } from 'Meta/types';
import { IEnumOption } from 'Controls-editors/dropdown';
import * as rk from 'i18n!Controls-Containers';

const StringEnumEditorOptions: readonly IEnumOption<string>[] = [
    { value: 'default', caption: rk('Акцентный') },
    { value: 'unaccented', caption: rk('Неакцентный') },
] as const;

export const ISelectedStyleOptionsType = ObjectType.id(
    'Controls-Containers-meta/interface:ISelectedStyleOptionsType'
)
    .title(rk('Стиль'))
    .description(rk('Стиль'))
    .properties({
        selectedStyle: StringType.title(rk('Стиль'))
            .editor('Controls-editors/dropdown:EnumEditor', {
                options: StringEnumEditorOptions,
            })
            .optional()
            .defaultValue('default')
            .order(2),
    });
