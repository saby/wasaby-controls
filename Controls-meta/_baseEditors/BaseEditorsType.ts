import * as rk from 'i18n!Controls';
import {
    WidgetType,
    StringType,
    BooleanType,
    NumberType,
    group,
    ArrayType,
    ObjectType,
    DateType,
} from 'Types/meta';
import { RecordSet } from 'Types/collection';

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
    sliderPercent?: number;
    slider?: number;
    chips?: DemoOptions;
    enumString: DemoOptions;
    enumStringTumbler: DemoOptions;
    enumStringTumblerIcon: DemoOptions;
    enumStringRadio: DemoOptions;
    enumNumberRadio: NumberEnumType;
    booleanCheckBox?: boolean;
    booleanCheckBox2?: boolean;
    LookupEditor?: { id: number; title: string };
    NumberMinMax?: number;
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

const numberMinMaxOptions = {
    afterInputText: '$',
    minValue: 1,
    maxValue: 10,
};

const BooleanCheckboxExampleType = BooleanType.id('Controls/meta:BooleanCheckboxExampleType')
    .title('Чекбокс переключатель')
    .editor(() => {
        return import('Controls-editors/properties').then(({ BooleanEditorCheckbox }) => {
            return BooleanEditorCheckbox;
        });
    });

export const BaseEditorsType = WidgetType.id('Controls/meta:BaseEditorsType')
    .title(rk('Набор базовых редакторов'))
    .description(rk('Пример для отображения всех базовых редакторов свойств'))
    .category(rk('Контролы'))
    .attributes<IBaseEditorsOptions>({
        ...group('Выпадающее меню', {
            enumString: StringType.oneOf(StringEnumEditorOptions)
                .title(rk('Единичный выбор'))
                .description(rk('Демонстрационный тип для редактора StringEnum'))
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ StringEnumEditor }) => {
                                return StringEnumEditor;
                            }
                        );
                    },
                    { options: StringEnumEditorOptions }
                ),
            multiSelect: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
                .title('Множественный выбор')
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ MultiStringEnumEditor }) => {
                                return MultiStringEnumEditor;
                            }
                        );
                    },
                    { options: multiEnumEditorOptions }
                )
                .optional(),
        }),
        ...group('Поля ввода', {
            multiLineText: StringType.title('Многострочное').editor(() => {
                return import('Controls-editors/properties').then(({ TextAreaEditor }) => {
                    return TextAreaEditor;
                });
            }),
            money: NumberType.title('Деньги').editor(() => {
                return import('Controls-editors/properties').then(({ MoneyEditor }) => {
                    return MoneyEditor;
                });
            }),
            phone: StringType.title('Телефон').editor(() => {
                return import('Controls-editors/properties').then(({ PhoneEditor }) => {
                    return PhoneEditor;
                });
            }),
            text: StringType.title('Однострочное'),
            number: NumberType.title('Числа'),
            LookupEditor: ObjectType.attributes({ id: NumberType, title: StringType })
                .title('Справочник')
                .editor(() => {
                    return import('Controls-editors/properties').then(({ LookupEditor }) => {
                        return LookupEditor;
                    });
                }),
            NumberMinMax: NumberType.title('мин-макс-число').editor(
                () => {
                    return import('Controls-editors/properties').then(({ NumberMinMaxEditor }) => {
                        return NumberMinMaxEditor;
                    });
                },
                { options: numberMinMaxOptions }
            ),
        }),
        ...group('Переключатель', {
            sliderPercent: NumberType.title('Ползунок(процентный)').editor(
                () => {
                    return import('Controls-editors/properties').then(({ SliderPercentEditor }) => {
                        return SliderPercentEditor;
                    });
                },
                { startTitle: 'тень', endTitle: 'свет' }
            ),
            slider: NumberType.title('Ползунок').editor(
                () => {
                    return import('Controls-editors/properties').then(({ SliderEditor }) => {
                        return SliderEditor;
                    });
                },
                { minValue: 0, maxValue: 1000 }
            ),
            chips: StringType.oneOf(StringEnumEditorOptions)
                .title('Chips')
                .order(1)
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(({ ChipsEditor }) => {
                            return ChipsEditor;
                        });
                    },
                    {
                        items: chipsItems,
                        allowEmptySelection: false,
                    }
                ),
            enumStringTumblerIcon: StringType.oneOf(StringEnumEditorOptions)
                .title('Тумблер (иконки)')
                .order(1)
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(({ TumblerEditor }) => {
                            return TumblerEditor;
                        });
                    },
                    { options: tumblerIconOptions }
                ),
            enumStringTumbler: StringType.oneOf(StringEnumEditorOptions)
                .title('Тумблер (stringEnum)')
                .order(1)
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ StringTumblerEditor }) => {
                                return StringTumblerEditor;
                            }
                        );
                    },
                    { options: StringEnumEditorOptions }
                ),
            boolean: BooleanType.title('Switch').editor(() => {
                return import('Controls-editors/properties').then(({ BooleanEditorSwitch }) => {
                    return BooleanEditorSwitch;
                });
            }),
            enumStringRadio: StringType.oneOf(StringEnumEditorOptions)
                .title(rk('Радиокнопки (stringEnum)'))
                .description(rk('Демонстрационный тип для редактора StringEnum'))
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ StringRadioGroupEditor }) => {
                                return StringRadioGroupEditor;
                            }
                        );
                    },
                    { options: StringEnumEditorOptions }
                ),
            enumNumberRadio: NumberType.title(rk('Радиокнопки (numberEnum)'))
                .description(rk('Демонстрационный тип для редактора StringEnum'))
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ NumberRadioGroupEditor }) => {
                                return NumberRadioGroupEditor;
                            }
                        );
                    },
                    { options: StringEnumEditorOptions }
                ),
            multiSelectStringCheckbox: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
                .title('Группа чекбоксов (stringEnum)')
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ StringCheckboxGroupEditor }) => {
                                return StringCheckboxGroupEditor;
                            }
                        );
                    },
                    { options: multiEnumEditorOptions }
                )
                .optional(),
            multiSelectNumberCheckbox: ArrayType.of(NumberType.oneOf(multiEnumEditorOptions))
                .title('Группа чекбоксов (numberEnum)')
                .editor(
                    () => {
                        return import('Controls-editors/properties').then(
                            ({ NumberCheckboxGroupEditor }) => {
                                return NumberCheckboxGroupEditor;
                            }
                        );
                    },
                    { options: multiEnumEditorOptions }
                )
                .optional(),
        }),
        ...group('Чекбоксы', {
            booleanCheckBox: BooleanCheckboxExampleType,
            booleanCheckBox2: BooleanCheckboxExampleType,
        }),
        ...group('Дата', {
            date: DateType.title('Дата').editor(() => {
                return import('Controls-editors/properties').then(({ DateEditor }) => {
                    return DateEditor;
                });
            }),
        }),
    })
    .defaultValue({
        multiSelect: ['option1'],
        enumString: 'option2',
        enumNumberRadio: 0,
        enumStringRadio: 'option2',
    });
