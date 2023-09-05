import { ObjectType, NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

interface IMultilineOptions {
    minLines?: number;
    maxLines?: number;
}

export const IMultilineOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:IMultilineOptionsType')
    .attributes<IMultilineOptions>({
        minLines: NumberType,
        maxLines: NumberType
    })
    .title(translate('Многострочность'))
    .editor(() => {
        return import('Controls-editors/properties').then(({MultilineEditor}) => {
            return MultilineEditor;
        });
    })
    .optional();
