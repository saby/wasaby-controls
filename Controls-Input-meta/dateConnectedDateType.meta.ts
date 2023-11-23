import { extended, group, WidgetType } from 'Types/meta';
import {
    FieldTypes,
    IDateDefaultValueOptionsType,
    IDateLimitOptionsType,
    IDateMaskType,
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;
const supportedFields = [FieldTypes.Date, FieldTypes.DateTime];
/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Date Date}
 */
const dateConnectedDateTypeMeta = WidgetType.id('Controls-Input/dateConnected:Date')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Дата'))
    .category(translate('Ввод данных'))
    .icon('icon-Calendar')
    .attributes({
        name: INameOptionsType.order(0).editorProps({fieldType: supportedFields}).required(),
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
    });

InlineRegistrar?.register(dateConnectedDateTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(dateConnectedDateTypeMeta.getId());

export default dateConnectedDateTypeMeta;
