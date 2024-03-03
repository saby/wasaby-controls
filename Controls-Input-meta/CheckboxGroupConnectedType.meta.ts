import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import { TOrientationType } from './_interface/checkboxGroup/TOrientationType';
import { TCheckboxGroupVariantsType } from './_interface/checkboxGroup/TCheckboxGroupVariantsType';
import {
    FieldTypes,
    ICheckboxGroupLabelOptionsType as ILabelOptionsType,
    ICheckboxRequiredOptionsType,
    INameOptionsType,
    IWrapTextOptionsType,
} from 'Controls-Input-meta/interface';
import { ICheckBoxGroupProps } from 'Controls-Input/CheckboxGroupConnected';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/CheckboxGroupConnected CheckboxGroupConnected}
 */
const CheckboxGroupConnectedTypeMeta = WidgetType.id('Controls-Input/CheckboxGroupConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Группа флагов'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/new-flags-group/'
    )
    .description('Редактор "Группа чекбоксов", работающий со слайсом формы')
    .category(rk('Ввод данных'))
    .icon('icon-Check2')
    .attributes<ICheckBoxGroupProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.Array] })
            .required(),
        ...TOrientationType.attributes(),
        ...ILabelOptionsType.attributes(),
        ...group('Варианты', {
            ...TCheckboxGroupVariantsType.attributes(),
        }),
        ...group('', {
            ...IWrapTextOptionsType.attributes(),
            ...ICheckboxRequiredOptionsType.attributes(),
        }),
    });

InlineRegistrar?.register(CheckboxGroupConnectedTypeMeta.getId());

export default CheckboxGroupConnectedTypeMeta;
