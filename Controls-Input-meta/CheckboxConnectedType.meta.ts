import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Types/meta';
import { ILabelOptionsType } from './_interface/checkbox/ILabelOptionsType';
import {
    INameOptionsType,
    IWrapTextOptionsType,
    ICheckboxRequiredOptionsType,
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
    .title(rk('Флаг'))
    .category(rk('Ввод данных'))
    .icon('icon-Check3')
    .attributes<ICheckBoxProps>({
        name: INameOptionsType.order(0),
        label: ILabelOptionsType.order(2),
        ...group('', {
            ...IWrapTextOptionsType.attributes(),
            ...ICheckboxRequiredOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(CheckboxConnectedTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(CheckboxConnectedTypeMeta.getId());

export default CheckboxConnectedTypeMeta;
