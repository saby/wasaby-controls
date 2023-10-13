import * as rk from 'i18n!Controls-Input';
import { BooleanType, ObjectType, StringType } from 'Types/meta';
import { IFlagVisibleOptions, IOnlyMobileOptions } from 'Controls-Input/interface';

const options = {
    flagPosition: [
        {value: 'start', caption: rk('Слева')},
        {value: 'end', caption: rk('Справа')},
    ],
};

export const IPhoneType = ObjectType.id('Controls-Input-meta/inputConnected:IPhoneType')
    .title(rk('Только мобильные'))
    .description(rk('Поле определяющее расположение и видимость флага'))
    .attributes<IFlagVisibleOptions & IOnlyMobileOptions>({
        onlyMobile: BooleanType.optional().order(4).defaultValue(false),
        flagVisible: BooleanType.optional().order(5).defaultValue(false),
        flagPosition: StringType.optional().oneOf(['start', 'end']).order(6).defaultValue('start'),
    })
    .editor(
        () => {
            return import('Controls-Input-editors/PhoneEditor').then(({PhoneEditor}) => {
                return PhoneEditor;
            });
        },
        {options}
    );
