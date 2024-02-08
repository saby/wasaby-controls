import { extended, group, WidgetType } from 'Meta/types';
import {
    FieldTypes,
    IDefaultTimeValueOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    ITimeIntervalType,
    ITimeLimitOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const supportedFields = [FieldTypes.DateTime, FieldTypes.Time];

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Time Time}
 */
const dateConnectedTimeTypeMeta = WidgetType.id('Controls-Input/dateConnected:Time')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Время'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/date-time/date/'
    )
    .description('Редактор типа "Время", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-TimeSkinny')
    .attributes({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        ...IDefaultTimeValueOptionsType.attributes(),
        ...ITimeIntervalType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Начало'))
            .order(4),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
                ...ITimeLimitOptionsType.attributes(),
            })
        ),
    });

InlineRegistrar?.register(dateConnectedTimeTypeMeta.getId());

export default dateConnectedTimeTypeMeta;
