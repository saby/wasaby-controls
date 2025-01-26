import {
    FieldTypes,
    IDefaultValueOptionsType,
    IMaskOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import { IMaskProps } from 'Controls-Input/inputConnected';
import * as translate from 'i18n!Controls-Input';
import { ArrayType, extended, group, WidgetType } from 'Meta/types';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [
    FieldTypes.StringCompatible,
    FieldTypes.String,
    FieldTypes.Email,
    FieldTypes.Link,
];
/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Mask Mask}
 */
const inputConnectedMaskTypeMeta = WidgetType.id('Controls-Input/inputConnected:Mask')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Маска'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/mask/'
    )
    .description('Редактор типа "Маска", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-TFLocalDrive')
    .properties<IMaskProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDefaultValueOptionsType.properties(),
        ...INoJumpingLabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...IMaskOptionsType.properties(),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.properties(),
            })
        ),
        ...IValidatorsOptionsType.properties(),
    })
    .appendStyles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(inputConnectedMaskTypeMeta.getId());

export default inputConnectedMaskTypeMeta;
