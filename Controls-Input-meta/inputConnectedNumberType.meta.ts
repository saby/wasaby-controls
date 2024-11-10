import { extended, group, WidgetType, ArrayType } from 'Meta/types';
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
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import { INumberProps } from 'Controls-Input/inputConnected';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [
    FieldTypes.Integer,
    FieldTypes.Double,
    FieldTypes.IntegerCompatible,
    FieldTypes.DoubleCompatible,
];
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
    .properties<INumberProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDefaultInputValueOptionsType.properties(),
        ...INoJumpingLabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties()
            .placeholder.defaultValue(translate('Укажите число'))
            .order(3),
        ...group('', {
            ...IUseGroupingOptionsType.properties(),
        }),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.properties(),
                ...IOnlyPositiveOptionsType.properties(),
                ...INumberLengthOptionsType.properties(),
                ...ILimitOptionsType.properties(),
            })
        ),
        ...IValidatorsOptionsType.properties(),
    })
    .styles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(inputConnectedNumberTypeMeta.getId());

export default inputConnectedNumberTypeMeta;
