// TODO: Временное дублирование файла Controls-demo\ObjectTypeEditor\BaseEditorsPopup\meta.ts.
//  Уйдет по задаче выноса всех демок проперти грида в отдельный модуль https://online.sbis.ru/opendoc.html?guid=f2dcba43-3b1a-4365-ad28-27600f52dfbc&client=3

import * as rk from 'i18n!Controls';
import {
    ArrayType,
    BooleanType,
    DateType,
    EnumType,
    group,
    NumberType,
    ObjectMetaAttributes,
    StringType,
    WidgetType,
} from 'Meta/types';
import { Enum, RecordSet } from 'Types/collection';

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

const BooleanCheckboxExampleType = BooleanType.id('Controls/meta:BooleanCheckboxExampleType')
    .title('Чекбокс переключатель')
    .editor('Controls-editors/CheckboxEditor:CheckboxEditor')
    .defaultValue(true);

const CollectionEnumValue = new Enum<object>({
    dictionary: ['Первый', 'Второй', 'Третий'],
    index: 0,
});

// Описание атрибутов мета-типа
const BaseEditorsAttrsDefaults: ObjectMetaAttributes<IBaseEditorsOptions> = {
    ...group('Время', {
        time: NumberType.title('Время')
            .editor('Controls-editors/properties:TimeEditor')
            .editorProps({
                mask: 'HH:mm:ss',
            })
            .defaultValue(undefined),
    }),
    ...group('Выпадающее меню', {
        enumString: StringType.oneOf(StringEnumEditorOptions)
            .title(rk('Единичный выбор'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor('Controls-editors/dropdown:EnumStringEditor', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(StringEnumEditorOptions[0]),
        multiSelect: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
            .title('Множественный выбор')
            .editor('Controls-editors/dropdown:MultiEnumStringEditor', {
                options: multiEnumEditorOptions,
            })
            .defaultValue([multiEnumEditorOptions[0]]),
        collectionEnumString: EnumType.title(rk('Collection Enum'))
            .editor('Controls-editors/dropdown:CollectionEnumEditor')
            .defaultValue(CollectionEnumValue),
    }),
    ...group('Поля ввода', {
        multiLineText: StringType.title('Многострочное')
            .editor('Controls-editors/input:AreaEditor')
            .defaultValue('Default text line1\nDefault text line2'),
        money: NumberType.title('Деньги')
            .editor('Controls-editors/input:MoneyEditor')
            .defaultValue(10),
        phone: StringType.title('Телефон')
            .editor('Controls-editors/input:PhoneEditor')
            .defaultValue('89001002525'),
        text: StringType.title('Однострочное').defaultValue('Default text'),
        number: NumberType.title('Числа').defaultValue(10),
    }),
    ...group('Переключатель', {
        slider: NumberType.title('Ползунок')
            .editor('Controls-editors/slider:SliderEditor', { minValue: 0, maxValue: 1000 })
            .defaultValue(1000),
        chips: StringType.oneOf(StringEnumEditorOptions)
            .title('Chips')
            .order(1)
            .editor('Controls-editors/toggle:ChipsEditor', {
                items: chipsItems,
                allowEmptySelection: false,
            })
            .defaultValue(chipsItems.getRawData()[0].id),
        enumStringTumblerIcon: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (иконки)')
            .order(1)
            .editor('Controls-editors/toggle:TumblerEditor', { options: tumblerIconOptions })
            .defaultValue(tumblerIconOptions.getRawData()[0].id),
        enumStringTumblerStrIcon: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (иконки)')
            .order(1)
            .editor('Controls-editors/toggle:TumblerEditor', { options: tumblerStrIconOptions }),
        enumStringTumbler: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (stringEnum)')
            .order(1)
            .editor('Controls-editors/toggle:TumblerEditorString', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(StringEnumEditorOptions[0]),
        boolean: BooleanType.title('Switch')
            .editor('Controls-editors/toggle:SwitchEditor')
            .defaultValue(true),
        enumStringRadio: StringType.oneOf(StringEnumEditorOptions)
            .title(rk('Радиокнопки (stringEnum)'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor('Controls-editors/radioGroupEditor:RadioGroupStringEditor', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(StringEnumEditorOptions[0]),
        enumNumberRadio: NumberType.title(rk('Радиокнопки (numberEnum)'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor('Controls-editors/radioGroupEditor:RadioGroupNumberEditor', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(0),
        multiSelectStringCheckbox: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
            .title('Группа чекбоксов (stringEnum)')
            .editor('Controls-editors/checkboxGroupEditor:CheckboxGroupStringEditor', {
                options: multiEnumEditorOptions,
            })
            .defaultValue([multiEnumEditorOptions[0]]),
        multiSelectNumberCheckbox: ArrayType.of(NumberType.oneOf(multiEnumEditorOptions))
            .title('Группа чекбоксов (numberEnum)')
            .editor('Controls-editors/checkboxGroupEditor:CheckboxGroupNumberEditor', {
                options: multiEnumEditorOptions,
            })
            .defaultValue([0]),
    }),
    ...group('Чекбоксы', {
        booleanCheckBox: BooleanCheckboxExampleType,
        booleanCheckBox2: BooleanCheckboxExampleType,
    }),
    ...group('Дата', {
        date: DateType.title('Дата')
            .editor('Controls-editors/date:DateEditor')
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
    .properties<IBaseEditorsOptions>(BaseEditorsAttrsDefaults);

export const BaseEditorsTypeRequired = WidgetType.id('Controls/demo:BaseEditorsAttrsRequired')
    .title(rk('Базовые редакторы без дефолтных значений атрибутов'))
    .properties<IBaseEditorsOptions>(BaseEditorsAttrsRequired);

export const BaseEditorsTypeOptional = WidgetType.id('Controls/demo:BaseEditorsAttrsOptional')
    .title(rk('Базовые редакторы с опциональными атрибутами'))
    .properties<IBaseEditorsOptions>(BaseEditorsAttrsOptional);
