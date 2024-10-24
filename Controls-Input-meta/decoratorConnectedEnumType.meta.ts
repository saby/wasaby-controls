import { WidgetType } from 'Meta/types';
import { IEnumProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:Enum';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Enum Enum}
 */
const decoratorConnectedEnumTypeMeta = WidgetType.id(id)
    .title(translate('Перечисление'))
    .category(translate('Данные'))
    .properties<IEnumProps>({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedEnumTypeMeta.getId());

export default decoratorConnectedEnumTypeMeta;
