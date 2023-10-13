import { WidgetType } from 'Types/meta';
import { IMultilineTextProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegister = FrameEditorSelection?.SelectionRuleRegistrer;

const id = 'Controls-Input/decoratorConnectedDesignTime:MultilineText';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnectedDesignTime:MultilineText MultilineText}
 */
const decoratorConnectedMultilineTextTypeMeta = WidgetType.id(id)
    .title(translate('Строка'))
    .category(translate('Данные'))
    .attributes<IMultilineTextProps>({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedMultilineTextTypeMeta.getId());
SelectionRuleRegister?.registerUnselectable(decoratorConnectedMultilineTextTypeMeta.getId());

export default decoratorConnectedMultilineTextTypeMeta;
