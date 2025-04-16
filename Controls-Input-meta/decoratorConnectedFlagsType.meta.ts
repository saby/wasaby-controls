import { WidgetType } from 'Meta/types';
import { IFlagsProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:Flags';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Flags Flags}
 */
const decoratorConnectedFlagsTypeMeta = WidgetType.id(id)
    .title(translate('флаги'))
    .category(translate('Данные'))
    .properties<IFlagsProps>({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedFlagsTypeMeta.getId());

export default decoratorConnectedFlagsTypeMeta;
