import * as rk from 'i18n!Controls';
import { BooleanType, ObjectType, StringType, NullType } from 'Meta/types';
import { IControlOptions } from 'UI/Base';
import { IThemeType } from './IThemeType';

export const IControlOptionsType = ObjectType.id(
    'Controls/meta:IControlOptionsType'
).attributes<IControlOptions>({
    theme: IThemeType.optional().hidden(),
    name: StringType.description(rk('Название контрола.')).optional().hidden(),
    notLoadThemes: BooleanType.description(
        rk('Флаг, который отключает загрузку переменных тем оформления для контролов.')
    )
        .optional()
        .hidden(),
    readOnly: BooleanType.title(rk('Только-чтение'))
        .description(
            rk(
                'Определяет, может ли пользователь изменить значение контрола (или взаимодействовать с контролом, если его значение не редактируется).'
            )
        )
        .optional()
        .hidden(),
    _$attributes: NullType,
    _$attrKey: NullType,
    _$blockOptionNames: NullType,
    _$createdFromCode: NullType,
    _$events: NullType,
    _$iWantBeWS3: NullType,
    _$key: NullType,
    _$preparedProps: NullType,
    _logicParent: NullType,
    _physicParent: NullType,
    _registerAsyncChild: NullType,
    $wasabyRef: NullType,
    fed: NullType,
    key: NullType,
    pageData: NullType,
    parent: NullType,
    Router: NullType,
    rskey: NullType,
    isAdaptive: NullType,
    adaptiveMode: NullType,
    content: NullType,
    customEvents: NullType,
    _$customEvents: NullType,
});
