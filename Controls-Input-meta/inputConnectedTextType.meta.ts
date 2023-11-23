import { extended, group, WidgetType } from 'Types/meta';
import {
    FieldTypes,
    IConstraintOptionsType,
    IDefaultValueOptionsType,
    ILabelOptionsType,
    ILengthOptionsType,
    IMultilineOptionsType,
    INameOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

const supportedTypes = [FieldTypes.Text, FieldTypes.Email, FieldTypes.Link];

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Text Text}
 */
const inputConnectedTextTypeMeta = WidgetType.id('Controls-Input/inputConnected:Text')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Текстовое поле'))
    .category(translate('Ввод данных'))
    .icon('icon-Rename')
    .attributes({
        name: INameOptionsType.order(0).editorProps({fieldType: supportedTypes}).required(),
        ...IDefaultValueOptionsType.attributes(),
        ...ILabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...group('', {
            ...IMultilineOptionsType.attributes(),
        }),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
                ...IConstraintOptionsType.attributes(),
                ...ILengthOptionsType.attributes(),
            })
        ),
    });

InlineRegistrar?.register(inputConnectedTextTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(inputConnectedTextTypeMeta.getId());

export default inputConnectedTextTypeMeta;
