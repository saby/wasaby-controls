import { WidgetType } from 'Types/meta';
import { ITimeProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType, ITimeIntervalType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegister = FrameEditorSelection?.SelectionRuleRegistrer;

const id = 'Controls-Input/decoratorConnected:Time';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Time Time}
 */
const decoratorConnectedTimeTypeMeta = WidgetType.id(id)
    .title(translate('Время'))
    .category(translate('Данные'))
    .attributes<ITimeProps>({
        name: INameOptionsType.order(0).required(),
        mask: ITimeIntervalType.order(1),
    });

InlineRegistrar?.register(decoratorConnectedTimeTypeMeta.getId());
SelectionRuleRegister?.registerUnselectable(decoratorConnectedTimeTypeMeta.getId());

export default decoratorConnectedTimeTypeMeta;
