import { extended, group, WidgetType } from 'Types/meta';
import { ITimeProps } from 'Controls-Input/dateConnected';
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
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;
const supportedFields = [FieldTypes.DateTime, FieldTypes.Time];

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Time Time}
 */
const dateConnectedTimeTypeMeta = WidgetType.id('Controls-Input/dateConnected:Time')
    .title(translate('Время'))
    .category(translate('Ввод данных'))
    .icon('icon-TimeSkinny')
    .attributes<ITimeProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedFields }).required(),
        defaultValue: IDefaultTimeValueOptionsType.order(1),
        mask: ITimeIntervalType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Начало'))
            .order(4),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(5),
                periodLimit: ITimeLimitOptionsType.order(6),
            })
        ),
    });

InlineRegistrar?.register(dateConnectedTimeTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(dateConnectedTimeTypeMeta.getId());

export default dateConnectedTimeTypeMeta;
