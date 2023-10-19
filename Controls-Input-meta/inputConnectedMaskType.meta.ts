import { WidgetType, group, extended } from 'Types/meta';
import { IMaskProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IMaskOptionsType,
    INoJumpingLabelOptionsType,
    IDefaultValueOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Mask Mask}
 */
const inputConnectedMaskTypeMeta = WidgetType.id('Controls-Input/inputConnected:Mask')
    .title(translate('Маска'))
    .category(translate('Ввод данных'))
    .attributes<IMaskProps>({
        name: INameOptionsType.order(0),
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
