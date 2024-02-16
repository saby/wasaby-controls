import * as rk from 'i18n!Controls';
import { BooleanType, ObjectType, StringType } from 'Meta/types';
import { IFlag } from '../Controls-editors/_properties/FlagEditor';

const options = {
    flagPosition: [
        {value: 'start', caption: rk('Слева')},
        {value: 'end', caption: rk('Справа')},
    ],
};

export const IFlagType = ObjectType.id('Controls/meta:IFlagType')
    .title(rk('Флаг страны'))
    .description(rk('Поле определяющее расположение и видимость флага'))
    .attributes<IFlag>({
        flagVisible: BooleanType.optional().defaultValue(false),
        flagPosition: StringType.optional().oneOf(['start', 'end']).defaultValue('end'),
    })
    // .editor(
    //     () => {
    //         return import('Controls-Input-editors/FlagEditor').then(({ FlagEditor }) => {
    //             return FlagEditor;
    //         });
    //     },
    //     {options}
    // );
