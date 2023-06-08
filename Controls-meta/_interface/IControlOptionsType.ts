import * as rk from 'i18n!Controls';
import { BooleanType, ObjectType, StringType } from 'Types/meta';
import { IControlOptions } from 'UI/Base';
import { IThemeType } from './IThemeType';

export const IControlOptionsType = ObjectType.id(
    'Controls/meta:IControlOptionsType'
).attributes<IControlOptions>({
    theme: IThemeType.optional(),
    name: StringType.description(rk('Название контрола.')).optional().hidden(),
    notLoadThemes: BooleanType.description(
        rk(
            'Флаг, который отключает загрузку переменных тем оформления для контролов.'
        )
    ).optional(),
    readOnly: BooleanType.title(rk('Только-чтение'))
        .description(
            rk(
                'Определяет, может ли пользователь изменить значение контрола (или взаимодействовать с контролом, если его значение не редактируется).'
            )
        )
        .optional(),
    _$attributes: null,
    _$attrKey: null,
    _$blockOptionNames: null,
    _$createdFromCode: null,
    _$events: null,
    _$iWantBeWS3: null,
    _$key: null,
    _$preparedProps: null,
    _logicParent: null,
    _physicParent: null,
    _registerAsyncChild: null,
    $wasabyRef: null,
    fed: null,
    key: null,
    pageData: null,
    parent: null,
    Router: null,
    rskey: null,
    isAdaptive: null,
    adaptiveMode: null,
    content: null,
    customEvents: null,
    _$customEvents: null,
});
