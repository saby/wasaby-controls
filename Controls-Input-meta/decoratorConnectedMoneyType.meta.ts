import { WidgetType } from 'Meta/types';
import { IMoneyProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:Money';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Money Money}
 */
const decoratorConnectedMoneyTypeMeta = WidgetType.id(id)
    .title(translate('Деньги'))
    .category(translate('Данные'))
    .attributes<IMoneyProps>({
        name: INameOptionsType.order(0).required(),
    });

InlineRegistrar?.register(decoratorConnectedMoneyTypeMeta.getId());

export default decoratorConnectedMoneyTypeMeta;
