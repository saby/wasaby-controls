import * as rk from 'i18n!Controls-Input';
import { BooleanType, ObjectType, StringType } from 'Types/meta';
import { IFlagVisibleOptions } from 'Controls-Input/interface';

const options = {
    flagPosition: [
        {value: 'start', caption: rk('Слева')},
        {value: 'end', caption: rk('Справа')},
    ],
};

export const IFlagType = ObjectType.id('Controls-Input-meta/inputConnected:IFlagType')
    .title(rk('Флаг страны'))
    .description(rk('Поле определяющее расположение и видимость флага'))
    .attributes<IFlagVisibleOptions>({
        flagVisible: BooleanType.optional().order(4).defaultValue(false),
        flagPosition: StringType.optional().oneOf(['start', 'end']).order(5).defaultValue('start'),
    })
    .editor(
        () => {
            return import('Controls-Input-editors/FlagEditor').then(({ FlagEditor }) => {
                return FlagEditor;
            });
        },
        {options}
    );
