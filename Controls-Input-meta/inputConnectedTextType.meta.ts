import { WidgetType, group, extended } from 'Types/meta';
import { ITextProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IConstraintOptionsType,
    IMultilineOptionsType,
    ILabelOptionsType,
    ILengthOptionsType,
    IDefaultValueOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Text Text}
 */
const inputConnectedTextTypeMeta = WidgetType.id('Controls-Input/inputConnected:Text')
    .title(translate('Текстовое поле'))
    .category(translate('Ввод данных'))
    .icon('icon-Rename')
    .attributes<ITextProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: ILabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...group('', {
            multiline: IMultilineOptionsType.order(4),
        }),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(6),
                constraint: IConstraintOptionsType.optional().order(7),
                length: ILengthOptionsType.order(8),
            })
        ),
    });

InlineRegistrar?.register(inputConnectedTextTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(inputConnectedTextTypeMeta.getId());

export default inputConnectedTextTypeMeta;
