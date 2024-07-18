import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface IMultilineOptions {
    minLines?: number;
    maxLines?: number;
}

export const IMultilineOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IMultilineOptionsType'
)
    .attributes({
        multiline: ObjectType.title(translate('Многострочность'))
            .attributes<IMultilineOptions>({
                minLines: NumberType,
                maxLines: NumberType,
            })
            .editor('Controls-Input-editors/MultilineEditor:MultilineEditor', {
                titlePosition: 'none',
            })
            .optional()
            .defaultValue({}),
    })
    .defaultValue({});
