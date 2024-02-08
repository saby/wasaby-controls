import { WidgetType } from 'Meta/types';
import { ITimeProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType, ITimeIntervalType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

const id = 'Controls-Input/decoratorConnected:Time';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Time Time}
 */
const decoratorConnectedTimeTypeMeta = WidgetType.id(id)
    .title(translate('Время'))
    .category(translate('Данные'))
    .attributes<ITimeProps>({
        name: INameOptionsType.order(0).required(),
        ...ITimeIntervalType.attributes(),
    });

InlineRegistrar?.register(decoratorConnectedTimeTypeMeta.getId());

export default decoratorConnectedTimeTypeMeta;
