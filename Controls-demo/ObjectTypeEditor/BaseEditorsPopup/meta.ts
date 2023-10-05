import * as rk from 'i18n!Controls';
import {
  ArrayType,
  BooleanType,
  DateType,
  group,
  NumberType,
  ObjectMetaAttributes,
  StringType,
  WidgetType,
} from 'Types/meta';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { names } from 'Controls-demo/PropertyGridNew/Editors/Lookup/resources/LookupData';

type DemoOptions = 'option1' | 'option2' | 'option3';

enum NumberEnumType {
    option1,
    option2,
    option3,
}

interface IBaseEditorsOptions {
    text?: string;
    multiLineText?: string;
    boolean?: boolean;
    number?: number;
    phone?: string;
    money?: number;
    slider?: number;
    chips?: DemoOptions;
    enumString: DemoOptions;
    enumStringTumbler: DemoOptions;
    enumStringTumblerIcon: DemoOptions;
    enumStringTumblerStrIcon: DemoOptions;
    enumStringRadio: DemoOptions;
    enumNumberRadio: NumberEnumType;
    booleanCheckBox?: boolean;
    booleanCheckBox2?: boolean;
    LookupEditor?: string[];
    multiSelect?: DemoOptions[];
    multiSelectStringCheckbox?: DemoOptions[];
    multiSelectNumberCheckbox?: NumberEnumType[];
    date?: Date;
}

const StringEnumEditorOptions: readonly DemoOptions[] = ['option1', 'option2', 'option3'] as const;

const multiEnumEditorOptions: readonly DemoOptions[] = ['option1', 'option2', 'option3'] as const;

const chipsItems = new RecordSet({
    rawData: [
        {
            id: 'option1',
            caption: 'option1',
        },
        {
            id: 'option2',
            caption: 'option2',
        },
        {
            id: 'option3',
            caption: 'option3',
        },
    ],
    keyProperty: 'id',
});

const tumblerIconOptions = new RecordSet({
    rawData: [
        {
            id: 'option1',
            icon: 'icon-Email',
        },
        {
            id: 'option2',
            icon: 'icon-Link',
        },
        {
            id: 'option3',
            icon: 'icon-EmptyMessage',
        },
    ],
    keyProperty: 'id',
});

const tumblerStrIconOptions = new RecordSet({
    rawData: [
        {
            id: 'option1',
            icon: 'icon-Email',
            title: 'option1',
            tooltip: 'Option 1 tooltip',
        },
        {
            id: 'option2',
            icon: 'icon-Link',
            title: 'option1',
        },
        {
            id: 'option3',
            icon: 'icon-EmptyMessage',
            title: 'option1',
        },
    ],
    keyProperty: 'id',
});

const lookupOptions = {
    source: new Memory({
        keyProperty: 'id',
        data: names,
    }),
    keyProperty: 'id',
    displayProperty: 'title',
    searchParam: 'title',
    selectorTemplate: {
        templateName: 'Controls-demo/PropertyGridNew/Editors/Lookup/resources/SelectorTemplate',
        templateOptions: {
            headingCaption: 'Выберите',
        },
        popupOptions: {
            width: 500,
        },
    },
};

const BooleanCheckboxExampleType = BooleanType.id('Controls/meta:BooleanCheckboxExampleType')
    .title('Чекбокс переключатель')
    .editor(() => {
        return import('Controls-editors/CheckboxEditor').then(({ CheckboxEditor }) => {
            return CheckboxEditor;
        });
    })
    .defaultValue(true);

// Описание атрибутов мета-типа
const BaseEditorsAttrsDefaults: ObjectMetaAttributes<IBaseEditorsOptions> = {
    ...group('Выпадающее меню', {
        enumString: StringType.oneOf(StringEnumEditorOptions)
            .title(rk('Единичный выбор'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor(
                () => {
                    return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                        return EnumStringEditor;
                    });
                },
                { options: StringEnumEditorOptions }
            )
            .defaultValue(StringEnumEditorOptions[0]),
        multiSelect: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
            .title('Множественный выбор')
            .editor(
                () => {
                    return import('Controls-editors/dropdown').then(({ MultiEnumStringEditor }) => {
                        return MultiEnumStringEditor;
                    });
                },
                { options: multiEnumEditorOptions }
            )
            .defaultValue([multiEnumEditorOptions[0]]),
    }),
    ...group('Поля ввода', {
        multiLineText: StringType.title('Многострочное')
            .editor(() => {
                return import('Controls-editors/input').then(({ AreaEditor }) => {
                    return AreaEditor;
                });
            })
            .defaultValue('Default text line1\nDefault text line2'),
        money: NumberType.title('Деньги')
            .editor(() => {
                return import('Controls-editors/input').then(({ MoneyEditor }) => {
                    return MoneyEditor;
                });
            })
            .defaultValue(10),
        phone: StringType.title('Телефон')
            .editor(() => {
                return import('Controls-editors/input').then(({ PhoneEditor }) => {
                    return PhoneEditor;
                });
            })
            .defaultValue('89001002525'),
        text: StringType.title('Однострочное').defaultValue('Default text'),
        number: NumberType.title('Числа').defaultValue(10),
        LookupEditor: ArrayType.of(StringType)
            .title('Справочник')
            .editor(
                () => {
                    return import('Controls-editors/properties').then(({ LookupEditor }) => {
                        return LookupEditor;
                    });
                },
                {
                    options: lookupOptions,
                }
            )
            .defaultValue([2]),
    }),
    ...group('Переключатель', {
        slider: NumberType.title('Ползунок')
            .editor(
                () => {
                    return import('Controls-editors/slider').then(({ SliderEditor }) => {
                        return SliderEditor;
                    });
                },
                { minValue: 0, maxValue: 1000 }
            )
            .defaultValue(1000),
        chips: StringType.oneOf(StringEnumEditorOptions)
            .title('Chips')
            .order(1)
            .editor(
                () => {
                    return import('Controls-editors/toggle').then(({ ChipsEditor }) => {
                        return ChipsEditor;
                    });
                },
                {
                    items: chipsItems,
                    allowEmptySelection: false,
                }
            )
            .defaultValue(chipsItems.getRawData()[0].id),
        enumStringTumblerIcon: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (иконки)')
            .order(1)
            .editor(
                () => {
                    return import('Controls-editors/toggle').then(({ TumblerEditor }) => {
                        return TumblerEditor;
                    });
                },
                { options: tumblerIconOptions }
            )
            .defaultValue(tumblerIconOptions.getRawData()[0].id),
        enumStringTumblerStrIcon: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (иконки)')
            .order(1)
            .editor(
                () => {
                    return import('Controls-editors/toggle').then(({ TumblerEditor }) => {
                        return TumblerEditor;
                    });
                },
                { options: tumblerStrIconOptions, titlePosition: 'top' }
            ).defaultValue(tumblerStrIconOptions.getRawData()[0].id),
        enumStringTumbler: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (stringEnum)')
            .order(1)
            .editor(
                () => {
                    return import('Controls-editors/toggle').then(({ TumblerEditorString }) => {
                        return TumblerEditorString;
                    });
                },
                { options: StringEnumEditorOptions, titlePosition: 'top' }
            )
            .defaultValue(StringEnumEditorOptions[0]),
        boolean: BooleanType.title('Switch')
            .editor(() => {
                return import('Controls-editors/toggle').then(({ SwitchEditor }) => {
                    return SwitchEditor;
                });
            })
            .defaultValue(true),
        enumStringRadio: StringType.oneOf(StringEnumEditorOptions)
            .title(rk('Радиокнопки (stringEnum)'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor(
                () => {
                    return import('Controls-editors/radioGroupEditor').then(
                        ({ RadioGroupStringEditor }) => {
                            return RadioGroupStringEditor;
                        }
                    );
                },
                { options: StringEnumEditorOptions }
            )
            .defaultValue(StringEnumEditorOptions[0]),
        enumNumberRadio: NumberType.title(rk('Радиокнопки (numberEnum)'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor(
                () => {
                    return import('Controls-editors/radioGroupEditor').then(
                        ({ RadioGroupNumberEditor }) => {
                            return RadioGroupNumberEditor;
                        }
                    );
                },
                { options: StringEnumEditorOptions }
            )
            .defaultValue(0),
        multiSelectStringCheckbox: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
            .title('Группа чекбоксов (stringEnum)')
            .editor(
                () => {
                    return import('Controls-editors/checkboxGroupEditor').then(
                        ({ CheckboxGroupStringEditor }) => {
                            return CheckboxGroupStringEditor;
                        }
                    );
                },
                { options: multiEnumEditorOptions }
            )
            .defaultValue([multiEnumEditorOptions[0]]),
        multiSelectNumberCheckbox: ArrayType.of(NumberType.oneOf(multiEnumEditorOptions))
            .title('Группа чекбоксов (numberEnum)')
            .editor(
                () => {
                    return import('Controls-editors/checkboxGroupEditor').then(
                        ({ CheckboxGroupNumberEditor }) => {
                            return CheckboxGroupNumberEditor;
                        }
                    );
                },
                { options: multiEnumEditorOptions }
            )
            .defaultValue([0]),
    }),
    ...group('Чекбоксы', {
        booleanCheckBox: BooleanCheckboxExampleType,
        booleanCheckBox2: BooleanCheckboxExampleType,
    }),
    ...group('Дата', {
        date: DateType.title('Дата')
            .editor(() => {
                return import('Controls-editors/date').then(({ DateEditor }) => {
                    return DateEditor;
                });
            })
            .defaultValue(new Date(Date.now())),
    }),
};

// Убираем из атрибутов меты дефолтные значения
const BaseEditorsAttrsRequired: ObjectMetaAttributes<IBaseEditorsOptions> = Object.keys(
    BaseEditorsAttrsDefaults
).reduce(
    (accum, key) => ({
        ...accum,
        [key]: BaseEditorsAttrsDefaults[key].defaultValue(undefined).required(),
    }),
    {} as ObjectMetaAttributes<IBaseEditorsOptions>
);

// Делаем все атрибуты меты опциональными
const BaseEditorsAttrsOptional: ObjectMetaAttributes<IBaseEditorsOptions> = Object.keys(
    BaseEditorsAttrsRequired
).reduce(
    (accum, key) => ({
        ...accum,
        [key]: BaseEditorsAttrsRequired[key].optional(),
    }),
    {} as ObjectMetaAttributes<IBaseEditorsOptions>
);

export const BaseEditorsTypeDefaults = WidgetType.id('Controls/demo:BaseEditorsTypeDefaults')
    .title(rk('Базовые редакторы с дефолтными значениями атрибутов'))
    .attributes<IBaseEditorsOptions>(BaseEditorsAttrsDefaults);

export const BaseEditorsTypeRequired = WidgetType.id('Controls/demo:BaseEditorsAttrsRequired')
    .title(rk('Базовые редакторы без дефолтных значений атрибутов'))
    .attributes<IBaseEditorsOptions>(BaseEditorsAttrsRequired);

export const BaseEditorsTypeOptional = WidgetType.id('Controls/demo:BaseEditorsAttrsOptional')
    .title(rk('Базовые редакторы с опциональными атрибутами'))
    .attributes<IBaseEditorsOptions>(BaseEditorsAttrsOptional);
