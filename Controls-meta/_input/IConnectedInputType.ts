import { ObjectType, ArrayType, StringType, NullType } from 'Types/meta';
import { IConnectedWidgetProps } from 'Controls/interface';
import * as translate from 'i18n!Controls';

export const IConnectedInputType = ObjectType.id(
    'Controls/meta:IConnectedInputType'
).attributes<IConnectedWidgetProps>({
    name: ArrayType.of(StringType)
        .title(translate('Поле контекста данных'))
        .description(
            translate(
                'Указывает на поле в контексте данных, из которого виджет читает данные и пишет изменения.'
            )
        )
        .optional(),
    value: NullType, // явно указываем, что виджет не нуждается в данных в пропсах
    onChange: NullType,
});
