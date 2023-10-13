import { WidgetType } from 'Types/meta';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegister = FrameEditorSelection?.SelectionRuleRegistrer;

const id = 'Controls-Input/decoratorConnectedDesignTime:Checkbox';

/**
 * Мета-описание типа декоратора {@link Controls-Input/decoratorConnectedDesignTime:Checkbox Checkbox}
 */
const decoratorConnectedDateTypeMeta = WidgetType.id(id)
    .title(translate('Флаг'))
    .category(translate('Данные'))
    .attributes({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedDateTypeMeta.getId());
SelectionRuleRegister?.registerUnselectable(decoratorConnectedDateTypeMeta.getId());

export default decoratorConnectedDateTypeMeta;
