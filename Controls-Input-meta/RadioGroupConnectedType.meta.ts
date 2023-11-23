import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Types/meta';
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
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/RadioGroupConnectedTypeMeta RadioGroupConnectedTypeMeta}
 */
const RadioGroupConnectedTypeMeta = WidgetType.id('Controls-Input/RadioGroupConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Радиогруппа'))
    .category(rk('Ввод данных'))
    .icon('icon-ListMarked')
    .attributes<IRadioGroupProps>({
        name: INameOptionsType.order(0)
            .editorProps({fieldType: [FieldTypes.Array]})
            .required(),
        ...TOrientationType.attributes(),
        ...ILabelOptionsType.attributes(),
        ...group('Варианты', {
            ...TRadioGroupVariantsType.attributes(),
        }),
        ...group('', {
            ...IWrapTextOptionsType.attributes(),
            ...ICheckboxRequiredOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(RadioGroupConnectedTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(RadioGroupConnectedTypeMeta.getId());

export default RadioGroupConnectedTypeMeta;
