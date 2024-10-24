import {
    FieldTypes,
    IConstraintOptionsType,
    IDefaultValueOptionsType,
    ILabelOptionsType,
    ILengthOptionsType,
    IMultilineOptionsType,
    INameOptionsType,
    IPlaceholderOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
    IValidatorsOptionsType,
} from 'Controls-Input-meta/interface';
import { ITextProps } from 'Controls-Input/inputConnected';
import * as translate from 'i18n!Controls-Input';
import { BooleanType, extended, group, WidgetType } from 'Meta/types';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const supportedTypes = [
    FieldTypes.String,
    FieldTypes.StringCompatible,
    FieldTypes.Email,
    FieldTypes.Link,
];

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Text Text}
 */
const inputConnectedTextTypeMeta = WidgetType.id('Controls-Input/inputConnected:Text')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('Текстовое поле'))
    .devguide('/doc/platform/developmentapl/interface-development/controls/input-elements/input/')
    .description('Редактор типа "Многострочный текст", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Rename')
    .properties<ITextProps>({
        name: INameOptionsType.order(0).editorProps({ fieldType: supportedTypes }).required(),
        ...IDefaultValueOptionsType.properties(),
        ...ILabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...group('', {
            ...IMultilineOptionsType.properties(),
        }),
        ...extended(
            group(translate('Ограничения'), {
                ...IRequiredOptionsType.properties(),
                ...IConstraintOptionsType.properties(),
                ...ILengthOptionsType.properties(),
            })
        ),
        leftFieldTemplate: WidgetType.hidden(),
        rightFieldTemplate: WidgetType.hidden(),
        readOnly: BooleanType.hidden(),
        ...IValidatorsOptionsType.properties(),
    })
    .appendStyles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(inputConnectedTextTypeMeta.getId());

export default inputConnectedTextTypeMeta;
