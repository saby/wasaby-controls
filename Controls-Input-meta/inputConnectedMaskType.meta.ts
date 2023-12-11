import { extended, group, WidgetType } from 'Types/meta';
import { IMaskProps } from 'Controls-Input/inputConnected';
import {
    FieldTypes,
    IDefaultValueOptionsType,
    IMaskOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;
const supportedFields = [FieldTypes.Text, FieldTypes.Email, FieldTypes.Link];
/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Mask Mask}
 */
const inputConnectedMaskTypeMeta = WidgetType.id('Controls-Input/inputConnected:Mask')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Маска'))
    .category(translate('Ввод данных'))
    .attributes<IMaskProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: INoJumpingLabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        mask: IMaskOptionsType.attributes().mask.order(4),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(5),
            })
        ),
    });

InlineRegistrar?.register(inputConnectedMaskTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(inputConnectedMaskTypeMeta.getId());

export default inputConnectedMaskTypeMeta;
