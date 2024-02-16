import { extended, group, WidgetType } from 'Meta/types';
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
    ISizeOptionsType,
    IUseGroupingOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.Integer, FieldTypes.Real];
/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Number Number}
 */
const inputConnectedNumberTypeMeta = WidgetType.id('Controls-Input/inputConnected:Number')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Число'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/number/'
    )
    .description('Редактор типа "Число", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Number')
    .attributes({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDefaultInputValueOptionsType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Укажите число'))
            .order(3),
        ...group('', {
            ...IUseGroupingOptionsType.attributes(),
        }),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
                ...IOnlyPositiveOptionsType.attributes(),
                ...INumberLengthOptionsType.attributes(),
                ...ILimitOptionsType.attributes(),
            })
        ),
    })
    .styles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(inputConnectedNumberTypeMeta.getId());

export default inputConnectedNumberTypeMeta;
