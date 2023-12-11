import { WidgetType } from 'Types/meta';
import { IDateProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType, IDateMaskType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegister = FrameEditorSelection?.SelectionRuleRegistrer;

const id = 'Controls-Input/decoratorConnectedDesignTime:Date';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnectedDesignTime:Date Date}
 */
const decoratorConnectedDateTypeMeta = WidgetType.id(id)
    .title(translate('Дата'))
    .category(translate('Данные'))
    .attributes<IDateProps>({
        name: INameOptionsType.order(0).required(),
        mask: IDateMaskType.order(1),
    });

InlineRegistrar?.register(decoratorConnectedDateTypeMeta.getId());
SelectionRuleRegister?.registerUnselectable(decoratorConnectedDateTypeMeta.getId());

export default decoratorConnectedDateTypeMeta;
