import { extended, group, WidgetType } from 'Meta/types';
import {
    FieldTypes,
    IDefaultPhoneValueOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPhoneType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Phone Phone}
 */
const inputConnectedPhoneTypeMeta = WidgetType.id('Controls-Input/inputConnected:Phone')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Телефон'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/phone/'
    )
    .description('Редактор типа "Телефон", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-PhoneNull')
    .attributes({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.Text] })
            .required(),
        ...IDefaultPhoneValueOptionsType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите номер'))
            .order(3),
        ...group('', {
            ...IPhoneType.attributes(),
        }),
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

InlineRegistrar?.register(inputConnectedPhoneTypeMeta.getId());

export default inputConnectedPhoneTypeMeta;
