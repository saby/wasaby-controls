import {
    FieldTypes,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    IStyleOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import { IMaskProps } from 'Controls-Input/inputConnected';
import * as translate from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.StringCompatible, FieldTypes.String];
/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Mask Mask}
 */
const extInputConnectedIPTypeMeta = WidgetType.id('Controls-Input/extInputConnected:IP')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title('IP')
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/mask/'
    )
    .description('Редактор типа "IP", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-IPmask')
    .properties<IMaskProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...INoJumpingLabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties().placeholder.order(3),
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

InlineRegistrar?.register(extInputConnectedIPTypeMeta.getId());

export default extInputConnectedIPTypeMeta;
