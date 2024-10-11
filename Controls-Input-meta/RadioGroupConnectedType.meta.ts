import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import { IRadioGroupProps } from 'Controls-Input/RadioGroupConnected';
import {
    FieldTypes,
    ICheckboxRequiredOptionsType,
    INameOptionsType,
    IRadioGroupLabelOptionsType as ILabelOptionsType,
    IWrapTextOptionsType,
    TOrientationType,
    TRadioGroupVariantsType,
} from 'Controls-Input-meta/interface';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/RadioGroupConnectedTypeMeta RadioGroupConnectedTypeMeta}
 */
const RadioGroupConnectedTypeMeta = WidgetType.id('Controls-Input/RadioGroupConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Радиогруппа'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/new-radio-group/'
    )
    .description('Редактор типа "Группа радиокнопок", работающий со слайсом формы')
    .category(rk('Ввод данных'))
    .icon('icon-ListMarked')
    .properties<IRadioGroupProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.Array, FieldTypes.Enumerable] })
            .required(),
        ...TOrientationType.properties(),
        ...ILabelOptionsType.properties(),
        ...group(null, {
            ...TRadioGroupVariantsType.properties(),
        }),
        ...group('', {
            ...IWrapTextOptionsType.properties(),
            ...ICheckboxRequiredOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(RadioGroupConnectedTypeMeta.getId());

export default RadioGroupConnectedTypeMeta;
