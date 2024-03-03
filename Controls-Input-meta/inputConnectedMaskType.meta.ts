import { extended, group, WidgetType } from 'Meta/types';
import {
    FieldTypes,
    IDefaultValueOptionsType,
    IMaskOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.Text, FieldTypes.Email, FieldTypes.Link];
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
    .attributes({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDefaultValueOptionsType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...IMaskOptionsType.attributes(),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
            })
        ),
    })
    .styles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(inputConnectedMaskTypeMeta.getId());

export default inputConnectedMaskTypeMeta;
