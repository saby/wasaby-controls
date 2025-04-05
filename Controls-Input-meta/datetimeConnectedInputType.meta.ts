import { group, WidgetType } from 'Meta/types';
import {
    FieldTypes,
    IDateLimitOptionsType,
    IDateTimeMaskType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    IStyleOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import { IDateTimeConnectedProps } from 'Controls-Input/datetimeConnected';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.Date, FieldTypes.DateTime];

/**
 * Мета-описание типа редактора {@link Controls-Input/datetimeConnected:Input datetimeConnected}
 */
const dateTimeConnectedInputTypeMeta = WidgetType.id('Controls-Input/datetimeConnected:Input')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Дата и время'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/date-time/date/'
    )
    .description('Редактор типа "дата и время", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Calendar2')
    .properties<IDateTimeConnectedProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDateTimeMaskType.properties(),
        ...INoJumpingLabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties().placeholder.order(4),
        ...group(translate('Ограничения'), '', {
            ...IRequiredOptionsType.properties(),
            //...IDateLimitOptionsType.properties(),
        }),
        ...IValidatorsOptionsType.properties(),
    })
    .appendStyles({
        ...group(translate('Стиль'), '', {
            ...IStyleOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(dateTimeConnectedInputTypeMeta.getId());

export default dateTimeConnectedInputTypeMeta;
