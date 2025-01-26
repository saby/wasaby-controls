import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import { ILabelOptionsType } from 'Controls-Input-meta/_interface/checkbox/ILabelOptionsType';
import {
    FieldTypes,
    ICheckboxRequiredOptionsType,
    INameOptionsType,
    IWrapTextOptionsType,
} from 'Controls-Input-meta/interface';
import { ICheckBoxProps } from 'Controls-Input/CheckboxConnected';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/CheckboxConnected CheckboxConnected}
 */
const CheckboxConnectedTypeMeta = WidgetType.id('Controls-Input/CheckboxConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Флаг'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/new-checkbox/'
    )
    .description('Редактор "чекбокса", работающий со слайсом формы')
    .category(rk('Ввод данных'))
    .icon('icon-Check3')
    .properties<ICheckBoxProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: [FieldTypes.Boolean] })
            .required(),
        ...ILabelOptionsType.properties(),
        ...group('', {
            ...IWrapTextOptionsType.properties(),
            ...ICheckboxRequiredOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(CheckboxConnectedTypeMeta.getId());

export default CheckboxConnectedTypeMeta;
