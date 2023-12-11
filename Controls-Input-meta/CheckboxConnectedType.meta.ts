import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Types/meta';
import { ILabelOptionsType } from './_interface/checkbox/ILabelOptionsType';
import {
    INameOptionsType,
    IWrapTextOptionsType,
    ICheckboxRequiredOptionsType,
    FieldTypes,
} from 'Controls-Input-meta/interface';
import { ICheckBoxProps } from 'Controls-Input/CheckboxConnected';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/CheckboxConnected CheckboxConnected}
 */
const CheckboxConnectedTypeMeta = WidgetType.id('Controls-Input/CheckboxConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Флаг'))
    .category(rk('Ввод данных'))
    .icon('icon-Check3')
    .attributes<ICheckBoxProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.Boolean] })
            .required(),
        label: ILabelOptionsType.order(2).defaultValue({
            label: rk('Метка'),
            labelPosition: 'captionEnd',
        }),
        ...group('', {
            ...IWrapTextOptionsType.attributes(),
            ...ICheckboxRequiredOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(CheckboxConnectedTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(CheckboxConnectedTypeMeta.getId());

export default CheckboxConnectedTypeMeta;
