import { extended, group, WidgetType } from 'Types/meta';
import { IMoneyProps } from 'Controls-Input/inputConnected';
import {
    FieldTypes,
    IDefaultInputValueOptionsType,
    ILimitOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    INumberLengthOptionsType,
    IOnlyPositiveOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    IUseGroupingOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;
const supportedFields = [FieldTypes.Integer, FieldTypes.Real, FieldTypes.Money];

const id = 'Controls-Input/inputConnected:Money';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Money Money}
 */
const inputConnectedMoneyTypeMeta = WidgetType.id('Controls-Input/inputConnected:Money')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Деньги'))
    .category(translate('Ввод данных'))
    .attributes<IMoneyProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        defaultValue: IDefaultInputValueOptionsType.order(1),
        label: INoJumpingLabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите сумму'))
            .order(3),
        ...group('', {
            useGrouping: IUseGroupingOptionsType.optional().order(4),
        }),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(5),
                onlyPositive: IOnlyPositiveOptionsType.optional().order(6),
                integersLength: INumberLengthOptionsType.attributes().integersLength.order(7),
                limit: ILimitOptionsType.order(8),
            })
        ),
    });

InlineRegistrar?.register(inputConnectedMoneyTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(inputConnectedMoneyTypeMeta.getId());

export default inputConnectedMoneyTypeMeta;
