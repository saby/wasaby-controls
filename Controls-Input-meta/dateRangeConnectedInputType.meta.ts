import { extended, group, WidgetType } from 'Meta/types';
import {
    IDateRangeMaskType,
    IDefaultRangeValueOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRangeLimitOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import { IDateRangeProps } from 'Controls-Input/dateRangeConnected';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:DateRange DateRange}
 */
const dateRangeConnectedInputTypeMeta = WidgetType.id('Controls-Input/dateRangeConnected:Input')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Период'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/date-time/date/'
    )
    .description('Редактор типа "Период", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-ConnectionPeriod')
    .properties<IDateRangeProps>({
        name: INameOptionsType.order(0).required(),
        ...IDefaultRangeValueOptionsType.properties(),
        ...IDateRangeMaskType.properties(),
        ...INoJumpingLabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties().placeholder.defaultValue('').order(4),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.properties(),
                ...IRangeLimitOptionsType.properties(),
            })
        ),
        ...IValidatorsOptionsType.properties(),
    })
    .styles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(dateRangeConnectedInputTypeMeta.getId());

export default dateRangeConnectedInputTypeMeta;
