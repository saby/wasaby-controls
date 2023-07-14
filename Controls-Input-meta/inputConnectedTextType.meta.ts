import { WidgetType, NullType, group } from 'Types/meta';
import { ITextProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IConstraintOptionsType,
    IMultilineOptionsType,
    ILabelOptionsType,
    ILengthOptionsType,
    IDefaultValueOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Text Text}
 */
const inputConnectedTextTypeMeta = WidgetType.id('Controls-Input/inputConnected:Text')
    .title(translate('Текст'))
    .category(translate('Ввод данных'))
    .icon('icon-Rename')
    .attributes<ITextProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: ILabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        ...group('', {
            multiline: IMultilineOptionsType.title('').order(4),
            richText: NullType, // Временно, так как контролы не должны зависеть от engine. Тут либо должен быть отдельный виджет, либо richEditor нужно вынести
        }),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(6),
            constraint: IConstraintOptionsType.optional().title('').order(7),
            length: ILengthOptionsType.order(8).title(''),
        }),
    });

export default inputConnectedTextTypeMeta;
