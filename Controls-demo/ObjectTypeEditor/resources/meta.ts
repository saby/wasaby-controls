import * as rk from 'i18n!Controls';
import {
    ArrayType,
    BooleanType,
    DateType,
    group,
    NumberType,
    ObjectMetaAttributes,
    ObjectType,
    StringType,
    WidgetType,
} from 'Meta/types';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';

type DemoOptions = 'option1' | 'option2' | 'option3';

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
    enumNumberRadio: number;
    booleanCheckBox?: boolean;
    booleanCheckBox2?: boolean;
    LookupEditor?: string[];
    multiSelect?: DemoOptions[];
    multiSelectStringCheckbox?: DemoOptions[];
    multiSelectNumberCheckbox?: number[];
    date?: Date;
}

const StringEnumEditorOptions: readonly DemoOptions[] = ['option1', 'option2', 'option3'] as const;

const multiEnumEditorOptions: readonly DemoOptions[] = ['option1', 'option2', 'option3'] as const;
const multiNumberEnumEditorOptions: readonly number[] = [0, 1, 2] as const;

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

export const names = [
    { id: '1', title: 'Sasha', text: 'test' },
    { id: '2', title: 'Dmitry', text: 'test' },
    { id: '3', title: 'Andrey', text: 'test' },
    { id: '4', title: 'Valery', text: 'test' },
    { id: '5', title: 'Aleksey', text: 'test' },
    { id: '6', title: 'Sasha', text: 'test' },
    { id: '7', title: 'Ivan', text: 'test' },
    { id: '8', title: 'Petr', text: 'test' },
    { id: '9', title: 'Roman', text: 'test' },
    { id: '10', title: 'Maxim', text: 'test' },
];

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

const items = [
    {
        id: 1,
        title: rk('Первый'),
        additional: false,
    },
    {
        id: 2,
        title: rk('Второй'),
        additional: false,
    },
];

const TreeEditorExampleType = ObjectType.id('Controls/meta:TreeEditorExampleType')
    .properties({
        // @ts-ignore
        variants: ObjectType.title(null)
            .editor<any>('Controls-editors/properties:TreeEditor', {
                expanderVisibility: 'hasChildren',
                allowHierarchy: true,
                items,
            })
            .properties({
                // @ts-ignore
                items: ArrayType.of(ObjectType),
                selectedKeys: ArrayType.of(NumberType),
            }),
    })
    .defaultValue({
        variants: {
            selectedKeys: [1],
        },
    });

const BooleanCheckboxExampleType = BooleanType.id('Controls/meta:BooleanCheckboxExampleType')
    .title('Чекбокс переключатель')
    .editor('Controls-editors/CheckboxEditor:CheckboxEditor')
    .defaultValue(true);

// Описание атрибутов мета-типа
const BaseEditorsAttrsDefaults = {
    title: StringType.editor('Controls-demo/ObjectTypeEditor/resources/TitleEditor:TitleEditor')
        .order(-1)
        .defaultValue('Default title'),
    ...group('Выпадающее меню', {
        enumString: StringType.oneOf(StringEnumEditorOptions)
            .title(rk('Единичный выбор'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor<any>('Controls-editors/dropdown:EnumStringEditor', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(StringEnumEditorOptions[0]),
        multiSelect: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
            .title('Множественный выбор')
            .editor<any>('Controls-editors/dropdown:MultiEnumStringEditor', {
                options: multiEnumEditorOptions,
            })
            .defaultValue([multiEnumEditorOptions[0]]),
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
        LookupEditor: ArrayType.of(StringType)
            .title('Справочник')
            .editor<any>('Controls-editors/properties:LookupEditor', {
                options: lookupOptions,
            })
            .defaultValue(['2']),
    }),
    ...group('Переключатель', {
        slider: NumberType.title('Ползунок')
            .editor<any>('Controls-editors/slider:SliderEditor', { minValue: 0, maxValue: 1000 })
            .defaultValue(1000),
        chips: StringType.oneOf(StringEnumEditorOptions)
            .title('Chips')
            .order(1)
            .editor<any>('Controls-editors/toggle:ChipsEditor', {
                items: chipsItems,
                allowEmptySelection: false,
            })
            .defaultValue(chipsItems.getRawData()[0].id),
        enumStringTumblerIcon: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (иконки)')
            .order(1)
            .editor<any>('Controls-editors/toggle:TumblerEditor', { options: tumblerIconOptions })
            .defaultValue(tumblerIconOptions.getRawData()[0].id),
        enumStringTumblerStrIcon: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (иконки)')
            .order(1)
            .editor<any>('Controls-editors/toggle:TumblerEditor', {
                options: tumblerStrIconOptions,
                titlePosition: 'top',
            })
            .defaultValue(tumblerStrIconOptions.getRawData()[0].id),
        enumStringTumbler: StringType.oneOf(StringEnumEditorOptions)
            .title('Тумблер (stringEnum)')
            .order(1)
            .editor<any>('Controls-editors/toggle:TumblerEditorString', {
                options: StringEnumEditorOptions,
                titlePosition: 'top',
            })
            .defaultValue(StringEnumEditorOptions[0]),
        boolean: BooleanType.title('Switch')
            .editor('Controls-editors/toggle:SwitchEditor')
            .defaultValue(true),
        enumStringRadio: StringType.oneOf(StringEnumEditorOptions)
            .title(rk('Радиокнопки (stringEnum)'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor<any>('Controls-editors/radioGroupEditor:RadioGroupStringEditor', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(StringEnumEditorOptions[0]),
        enumNumberRadio: NumberType.title(rk('Радиокнопки (numberEnum)'))
            .description(rk('Демонстрационный тип для редактора StringEnum'))
            .editor<any>('Controls-editors/radioGroupEditor:RadioGroupNumberEditor', {
                options: StringEnumEditorOptions,
            })
            .defaultValue(0),
        multiSelectStringCheckbox: ArrayType.of(StringType.oneOf(multiEnumEditorOptions))
            .title('Группа чекбоксов (stringEnum)')
            .editor<any>('Controls-editors/checkboxGroupEditor:CheckboxGroupStringEditor', {
                options: multiEnumEditorOptions,
            })
            .defaultValue([multiEnumEditorOptions[0]]),
        multiSelectNumberCheckbox: ArrayType.of(NumberType.oneOf(multiNumberEnumEditorOptions))
            .title('Группа чекбоксов (numberEnum)')
            .editor<any>('Controls-editors/checkboxGroupEditor:CheckboxGroupNumberEditor', {
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
            .defaultValue(new Date()),
    }),
    ...group('Список', {
        ...TreeEditorExampleType.properties(),
    }),
};

// Убираем из атрибутов меты дефолтные значения
const BaseEditorsAttrsRequired = Object.keys(BaseEditorsAttrsDefaults).reduce(
    (accum, key) => ({
        ...accum,
        // @ts-ignore
        [key]: BaseEditorsAttrsDefaults[key].defaultValue(undefined).required(),
    }),
    {} as ObjectMetaAttributes<IBaseEditorsOptions>
);

// Делаем все атрибуты меты опциональными
const BaseEditorsAttrsOptional = Object.keys(BaseEditorsAttrsRequired).reduce(
    (accum, key) => ({
        ...accum,
        // @ts-ignore
        [key]: BaseEditorsAttrsRequired[key].optional(),
    }),
    {} as ObjectMetaAttributes<IBaseEditorsOptions>
);

export const BaseEditorsTypeDefaults = WidgetType.id('Controls/demo:BaseEditorsTypeDefaults')
    .title(rk('Базовые редакторы с дефолтными значениями атрибутов'))
    .properties(BaseEditorsAttrsDefaults);

export const BaseEditorsTypeRequired = WidgetType.id('Controls/demo:BaseEditorsAttrsRequired')
    .title(rk('Базовые редакторы без дефолтных значений атрибутов'))
    .properties(BaseEditorsAttrsRequired);

export const BaseEditorsTypeOptional = WidgetType.id('Controls/demo:BaseEditorsAttrsOptional')
    .title(rk('Базовые редакторы с опциональными атрибутами'))
    .properties(BaseEditorsAttrsOptional);
