import { WidgetType, group } from 'Types/meta';
import { ITextProps } from 'Controls-Input/inputConnected';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { IDefaultValueOptionsType } from './_interface/_input/IDefaultValueOptionsType';
import { IConstraintOptionsType } from './_interface/_input/IConstraintOptionsType';
import { IMultilineOptionsType } from './_interface/_input/IMultilineOptionsType';
import { IRichTextOptionsType } from './_interface/_input/IRichTextOptionsType';
import { ILengthOptionsType } from './_interface/_input/ILengthOptionsType';
import { ILabelOptionsType } from './_interface/_input/ILabelOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Text Text}
 */
const inputConnectedTextTypeMeta = WidgetType.id('Controls-Input/inputConnected:Text')
    .title(translate('Текст'))
    .category(translate('Ввод данных'))
    .attributes<ITextProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: ILabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...group('', {
            multiline: IMultilineOptionsType.title(''),
            richText: IRichTextOptionsType,
        }),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(7),
            constraint: IConstraintOptionsType.optional().title('').order(8),
            length: ILengthOptionsType.order(9).title('')
        })
    });

export default inputConnectedTextTypeMeta;
