import { extended, group, WidgetType } from 'Types/meta';
import {
    FieldTypes,
    IDefaultInputValueOptionsType,
    IIntegersLengthOptionsType,
    ILimitOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IOnlyPositiveOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    IUseGroupingOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;
const supportedFields = [FieldTypes.Integer, FieldTypes.Real, FieldTypes.Money];

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Money Money}
 */
const inputConnectedMoneyTypeMeta = WidgetType.id('Controls-Input/inputConnected:Money')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Деньги'))
    .category(translate('Ввод данных'))
    .attributes({
        name: INameOptionsType.order(0).editorProps({fieldType: supportedFields}).required(),
        ...IDefaultInputValueOptionsType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите сумму'))
            .order(3),
        ...group('', {
            ...IUseGroupingOptionsType.attributes(),
        }),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
                ...IOnlyPositiveOptionsType.attributes(),
                ...IIntegersLengthOptionsType.attributes(),
                ...ILimitOptionsType.attributes(),
            })
        ),
    });

InlineRegistrar?.register(inputConnectedMoneyTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(inputConnectedMoneyTypeMeta.getId());

export default inputConnectedMoneyTypeMeta;
