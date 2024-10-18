import { WidgetType } from 'Meta/types';
import { IDateProps } from 'Controls-Input/decoratorConnected';
import { IDateMaskType, INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:Date';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Date Date}
 */
const decoratorConnectedDateTypeMeta = WidgetType.id(id)
    .title(translate('Дата'))
    .category(translate('Данные'))
    .properties<IDateProps>({
        name: INameOptionsType.order(0).required(),
        ...IDateMaskType.properties(),
    });

InlineRegistrar?.register(decoratorConnectedDateTypeMeta.getId());

export default decoratorConnectedDateTypeMeta;
