import {
    FieldTypes,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IRequiredOptionsType,
    IStyleOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import { IMaskProps } from 'Controls-Input/inputConnected';
import * as translate from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.Boolean];
/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Mask Mask}
 */
const extDropdownConnectedBooleanTypeMeta = WidgetType.id(
    'Controls-Input/extDropdownConnected:Boolean'
)
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title('Логическое')
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/mask/'
    )
    .description('Редактор типа "Логическое", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Boolean')
    .properties<IMaskProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...INoJumpingLabelOptionsType.properties(),
        ...group(translate('Ограничения'), '', {
            ...IRequiredOptionsType.properties(),
        }),
        ...IValidatorsOptionsType.properties(),
    })
    .appendStyles({
        ...group(translate('Стиль'), '', {
            ...IStyleOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(extDropdownConnectedBooleanTypeMeta.getId());

export default extDropdownConnectedBooleanTypeMeta;
