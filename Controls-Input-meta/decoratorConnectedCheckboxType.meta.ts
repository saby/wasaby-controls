import { WidgetType } from 'Types/meta';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegister = FrameEditorSelection?.SelectionRuleRegistrer;

const id = 'Controls-Input/decoratorConnected:Checkbox';

/**
 * Мета-описание типа декоратора {@link Controls-Input/decoratorConnected:Checkbox Checkbox}
 */
const decoratorConnectedCheckboxTypeMeta = WidgetType.id(id)
    .title(translate('Флаг'))
    .category(translate('Данные'))
    .attributes({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedCheckboxTypeMeta.getId());
SelectionRuleRegister?.registerUnselectable(decoratorConnectedCheckboxTypeMeta.getId());

export default decoratorConnectedCheckboxTypeMeta;
