import { WidgetType, group, extended } from 'Types/meta';
import { IDateProps } from 'Controls-Input/dateConnected';
import {
    IDateMaskType,
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IDateLimitOptionsType,
    INoJumpingLabelOptionsType,
    IDateDefaultValueOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Date Date}
 */
const dateConnectedDateTypeMeta = WidgetType.id('Controls-Input/dateConnected:Date')
    .title(translate('Дата'))
    .category(translate('Ввод данных'))
    .icon('icon-Calendar')
    .attributes<IDateProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDateDefaultValueOptionsType.order(1),
        mask: IDateMaskType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Начало'))
            .order(4),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(5),
                periodLimit: IDateLimitOptionsType.order(6),
            })
        ),
    });

InlineRegistrar?.register(dateConnectedDateTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(dateConnectedDateTypeMeta.getId());

export default dateConnectedDateTypeMeta;
