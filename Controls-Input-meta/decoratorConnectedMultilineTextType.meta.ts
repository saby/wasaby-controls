import { WidgetType } from 'Meta/types';
import { IMultilineTextProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:MultilineText';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:MultilineText MultilineText}
 */
const decoratorConnectedMultilineTextTypeMeta = WidgetType.id(id)
    .title(translate('Строка'))
    .category(translate('Данные'))
    .attributes<IMultilineTextProps>({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedMultilineTextTypeMeta.getId());

export default decoratorConnectedMultilineTextTypeMeta;
