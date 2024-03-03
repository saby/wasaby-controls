import { extended, group, WidgetType } from 'Meta/types';
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
    ISizeOptionsType,
    IUseGroupingOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.Integer, FieldTypes.Real, FieldTypes.Money];

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Money Money}
 */
const inputConnectedMoneyTypeMeta = WidgetType.id('Controls-Input/inputConnected:Money')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Деньги'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/money/'
    )
    .description('Редактор типа "Деньги", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Money')
    .attributes({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
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
    })
    .styles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(inputConnectedMoneyTypeMeta.getId());

export default inputConnectedMoneyTypeMeta;
