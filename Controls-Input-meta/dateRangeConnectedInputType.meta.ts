import { extended, group, WidgetType } from 'Types/meta';
import {
    IDateMaskType,
    IDefaultRangeValueOptionsType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRangeLimitOptionsType,
    IRequiredOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:DateRange DateRange}
 */
const dateRangeConnectedInputTypeMeta = WidgetType.id('Controls-Input/dateRangeConnected:Input')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Период'))
    .category(translate('Ввод данных'))
    .icon('icon-ConnectionPeriod')
    .attributes({
        name: INameOptionsType.order(0).required(),
        ...IDefaultRangeValueOptionsType.attributes(),
        ...IDateMaskType.attributes(),
        ...INoJumpingLabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('12.12.12'))
            .order(4),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.attributes(),
                ...IRangeLimitOptionsType.attributes(),
            })
        ),
    });

InlineRegistrar?.register(dateRangeConnectedInputTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(dateRangeConnectedInputTypeMeta.getId());

export default dateRangeConnectedInputTypeMeta;
