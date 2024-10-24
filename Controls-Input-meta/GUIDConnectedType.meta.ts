import {
    FieldTypes,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    ISizeOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import { IGUIDConnectedProps } from 'Controls-Input/GUIDConnected';
import * as translate from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/GUIDConnected GUID}
 */
const GUIDConnectedTypeMeta = WidgetType.id('Controls-Input/GUIDConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title('GUID')
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/GUID/'
    )
    .description('Редактор типа "GUID", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Info')
    .properties<IGUIDConnectedProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.String, FieldTypes.StringCompatible] })
            .required(),
        ...INoJumpingLabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties()
            .placeholder.defaultValue(translate('Введите GUID'))
            .order(3),
        ...IValidatorsOptionsType.properties(),
    })
    .appendStyles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(GUIDConnectedTypeMeta.getId());

export default GUIDConnectedTypeMeta;