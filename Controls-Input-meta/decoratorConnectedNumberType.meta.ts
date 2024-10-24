import { WidgetType } from 'Meta/types';
import { INumberProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType, IPrecisionOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:Number';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Number Number}
 */
const decoratorConnectedNumberTypeMeta = WidgetType.id(id)
    .title(translate('Число'))
    .category(translate('Данные'))
    .properties<INumberProps>({
        name: INameOptionsType.order(0).required(),
        ...IPrecisionOptionsType.properties(),
    });

InlineRegistrar?.register(decoratorConnectedNumberTypeMeta.getId());

export default decoratorConnectedNumberTypeMeta;
