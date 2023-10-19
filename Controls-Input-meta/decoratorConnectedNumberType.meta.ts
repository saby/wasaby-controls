import { WidgetType } from 'Types/meta';
import { INumberProps } from 'Controls-Input/decoratorConnected';
import { INameOptionsType, INumberLengthOptionsType } from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegister = FrameEditorSelection?.SelectionRuleRegistrer;

const id = 'Controls-Input/decoratorConnected:Number';

/**
 * Мета-описание типа редактора {@link Controls-Input/decoratorConnected:Number Number}
 */
const decoratorConnectedNumberTypeMeta = WidgetType.id(id)
    .title(translate('Число'))
    .category(translate('Данные'))
    .attributes<INumberProps>({
        name: INameOptionsType.order(0),
        precision: INumberLengthOptionsType.attributes().precision.order(1),
    });

InlineRegistrar?.register(decoratorConnectedNumberTypeMeta.getId());
SelectionRuleRegister?.registerUnselectable(decoratorConnectedNumberTypeMeta.getId());

export default decoratorConnectedNumberTypeMeta;
