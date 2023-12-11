import { WidgetType, group, extended } from 'Types/meta';
import { IPhoneProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    INoJumpingLabelOptionsType,
    IPhoneType,
    IDefaultPhoneValueOptionsType,
    FieldTypes,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Phone Phone}
 */
const inputConnectedPhoneTypeMeta = WidgetType.id('Controls-Input/inputConnected:Phone')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Телефон'))
    .category(translate('Ввод данных'))
    .icon('icon-PhoneNull')
    .attributes<IPhoneProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.Text] })
            .required(),
        defaultValue: IDefaultPhoneValueOptionsType.order(1),
        label: INoJumpingLabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите номер'))
            .order(3),
        ...group('', {
            ...IPhoneType.attributes(),
        }),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(7),
            })
        ),
    });

InlineRegistrar?.register(inputConnectedPhoneTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(inputConnectedPhoneTypeMeta.getId());

export default inputConnectedPhoneTypeMeta;
