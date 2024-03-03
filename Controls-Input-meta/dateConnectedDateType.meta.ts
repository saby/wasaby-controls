import { ArrayType, extended, group, WidgetType } from 'Meta/types';
import {
    FieldTypes,
    IDateDefaultValueOptionsType,
    IDateLimitOptionsType,
    IDateMaskType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
} from 'Controls-Input-meta/interface';
import { IDateProps } from 'Controls-Input/dateConnected';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.Date, FieldTypes.DateTime];
/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Date Date}
 */
const dateConnectedDateTypeMeta = WidgetType.id('Controls-Input/dateConnected:Date')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Дата'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/date/'
    )
    .description('Редактор типа "Дата", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Calendar')
    .attributes<IDateProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDateDefaultValueOptionsType.attributes(),
        ...IDateMaskType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Начало'))
            .order(4),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
                ...IDateLimitOptionsType.attributes(),
            })
        ),
        validators: ArrayType.hidden(),
    })
    .styles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(dateConnectedDateTypeMeta.getId());

export default dateConnectedDateTypeMeta;
