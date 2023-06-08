import * as rk from 'i18n!Controls';
import { BooleanType, StringType, ObjectType } from 'Types/meta';
import { IFlag } from '../Controls-editors/_properties/FlagEditor';

const options = {
    flagPosition: [
        { value: 'start', caption: rk('Слева') },
        { value: 'end', caption: rk('Справа') },
    ],
};

export const IFlagType = ObjectType.id('Controls/meta:IFlagType')
    .title(rk('Флаг страны'))
    .description(rk('Поле определяющее расположение и видимость флага'))
    .attributes<IFlag>({
        flagVisible: BooleanType.optional().defaultValue(),
        flagPosition: StringType.optional().defaultValue('end'),
    })
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ FlagEditor }) => {
                    return FlagEditor;
                }
            );
        },
        { options }
    );
