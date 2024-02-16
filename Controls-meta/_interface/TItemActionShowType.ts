import { NumberType } from 'Meta/types';
import * as rk from 'i18n!Controls';
import { TItemActionShowType as TItemActionShowTypeEnum } from 'Controls/interface';

const options: readonly TItemActionShowTypeEnum[] = [
    TItemActionShowTypeEnum.MENU,
    TItemActionShowTypeEnum.MENU_TOOLBAR,
    TItemActionShowTypeEnum.TOOLBAR,
    TItemActionShowTypeEnum.FIXED,
] as const;

export const TItemActionShowType = NumberType.id('Controls/meta:TItemActionShowType')
    .oneOf(options)
    .description(
        rk(
            'Позволяет настроить, какие опции записи будут показаны по ховеру, а какие - в доп.меню.'
        )
    )
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ EnumEditor }) => {
                return EnumEditor;
            });
        },
        {
            options: [
                { value: TItemActionShowTypeEnum.MENU, caption: rk('Меню') },
                {
                    value: TItemActionShowTypeEnum.MENU_TOOLBAR,
                    caption: rk('Меню панель инструментов'),
                },
                {
                    value: TItemActionShowTypeEnum.TOOLBAR,
                    caption: rk('Панель инструментов'),
                },
                {
                    value: TItemActionShowTypeEnum.FIXED,
                    caption: rk('Фиксировано'),
                },
            ],
        }
    );
