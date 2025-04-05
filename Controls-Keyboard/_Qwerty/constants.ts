import * as templateLangButton from 'wml!Controls-Keyboard/_Qwerty/templates/langButton';
import * as templateCharButton from 'wml!Controls-Keyboard/_Qwerty/templates/charButton';
import * as templateShiftButton from 'wml!Controls-Keyboard/_Qwerty/templates/shiftButton';
import * as templateAccentButton from 'wml!Controls-Keyboard/_Qwerty/templates/accentButton';
import * as templateKeyboardButton from 'wml!Controls-Keyboard/_Qwerty/templates/keyboardButton';
import * as templateBackspaceButton from 'wml!Controls-Keyboard/_Qwerty/templates/backspaceButton';
import { IKeyboardItem } from 'Controls-Keyboard/View';
import { TemplateFunction } from 'UI/Base';

// Дефолтные настройки открытия клавиатуры
const defaultOptions = {
    template: 'Controls-Keyboard/Qwerty',
    direction: {
        vertical: 'top',
        horizontal: 'center',
    },
    targetPoint: {
        vertical: 'bottom',
        horizontal: 'center',
    },
    fittingMode: {
        vertical: 'overflow',
        horizontal: 'overflow',
    },
};

// Тип для модификаторов ширины
type widthModifier = 'accentButton' | 'shift' | 'space';

// Языки клавиатуры
enum Langs {
    Ru = 0,
    En = 1,
}

// Шаблонные настройки для кнопок
const templatesOfButtons: { [key: string]: TemplateFunction } = {
    // Шаблон для клавиши языковой раскладки
    langButton: templateLangButton,

    // Шаблон для акцентной клавиши
    accentButton: templateAccentButton,

    // Шаблон для клавиши буквенной или цифровой раскладки
    charButton: templateCharButton,

    // Шаблон для клавиши shift
    shiftButton: templateShiftButton,

    // Шаблон для клавиши Клавиатура
    keyboardButton: templateKeyboardButton,

    // Шаблон для клавиши backspace
    backspaceButton: templateBackspaceButton,
};

// Задание левого отступа для второй строки
const leftMarginSecondRow = 'qwertySecondRow';

// Задание левого отступа для третьей строки
const leftMarginThirdRow = 'qwertyThirdRow';

// Модификатор размера accentButton
const accentButtonWidthModifier: widthModifier = 'accentButton';

// Модификатор размера shift
const shiftWidthModifier: widthModifier = 'shift';

// Модификатор размера space
const spaceWidthModifier: widthModifier = 'space';

// Строковые настройки для кнопок
const configsOfButtons: { [key: string]: string } = {
    // Иконка для backspace
    backspace: 'icon-Erase1',

    // Размер иконки для backspace
    backspaceSize: 'l',
};

// Последняя строка в клавиатуре
const lastRow: IKeyboardItem[] = [
    {
        type: 'action',
        value: 'lang',
        contentTemplate: templatesOfButtons.langButton,
    },
    {
        type: 'action',
        value: 'char',
        contentTemplate: templatesOfButtons.charButton,
    },
    {
        type: 'action',
        value: ' ',
        caption: ' ',
        widthModifier: spaceWidthModifier,
    },
    {
        type: 'mainAction',
        value: 'accentButton',
        widthModifier: accentButtonWidthModifier,
        contentTemplate: templatesOfButtons.accentButton,
    },
    {
        type: 'action',
        value: 'keyboard',
        contentTemplate: templatesOfButtons.keyboardButton,
    },
];

// Элементы рассладок клавиатур
const allItems: { [key: string]: IKeyboardItem[][] } = {
    RuUp: [
        [
            {
                type: 'input',
                value: 'Й',
                caption: 'Й',
            },
            {
                type: 'input',
                value: 'Ц',
                caption: 'Ц',
            },
            {
                type: 'input',
                value: 'У',
                caption: 'У',
            },
            {
                type: 'input',
                value: 'К',
                caption: 'К',
            },
            {
                type: 'input',
                value: 'Е',
                caption: 'Е',
            },
            {
                type: 'input',
                value: 'Н',
                caption: 'Н',
            },
            {
                type: 'input',
                value: 'Г',
                caption: 'Г',
            },
            {
                type: 'input',
                value: 'Ш',
                caption: 'Ш',
            },
            {
                type: 'input',
                value: 'Щ',
                caption: 'Щ',
            },
            {
                type: 'input',
                value: 'З',
                caption: 'З',
            },
            {
                type: 'input',
                value: 'Х',
                caption: 'Х',
            },
            {
                type: 'remove',
                value: 'backspace',
                contentTemplate: templatesOfButtons.backspaceButton,
            },
        ],
        [
            {
                type: 'input',
                value: 'Ф',
                caption: 'Ф',
                leftMarginModifier: leftMarginSecondRow,
            },
            {
                type: 'input',
                value: 'Ы',
                caption: 'Ы',
            },
            {
                type: 'input',
                value: 'В',
                caption: 'В',
            },
            {
                type: 'input',
                value: 'А',
                caption: 'А',
            },
            {
                type: 'input',
                value: 'П',
                caption: 'П',
            },
            {
                type: 'input',
                value: 'Р',
                caption: 'Р',
            },
            {
                type: 'input',
                value: 'О',
                caption: 'О',
            },
            {
                type: 'input',
                value: 'Л',
                caption: 'Л',
            },
            {
                type: 'input',
                value: 'Д',
                caption: 'Д',
            },
            {
                type: 'input',
                value: 'Ж',
                caption: 'Ж',
            },
            {
                type: 'input',
                value: 'Э',
                caption: 'Э',
            },
        ],
        [
            {
                type: 'action',
                value: 'shift',
                contentTemplate: templatesOfButtons.shiftButton,
                widthModifier: shiftWidthModifier,
            },
            {
                type: 'input',
                value: 'Я',
                caption: 'Я',
            },
            {
                type: 'input',
                value: 'Ч',
                caption: 'Ч',
            },
            {
                type: 'input',
                value: 'С',
                caption: 'С',
            },
            {
                type: 'input',
                value: 'М',
                caption: 'М',
            },
            {
                type: 'input',
                value: 'И',
                caption: 'И',
            },
            {
                type: 'input',
                value: 'Т',
                caption: 'Т',
            },
            {
                type: 'input',
                value: 'Ь',
                caption: 'Ь',
            },
            {
                type: 'input',
                value: 'Б',
                caption: 'Б',
            },
            {
                type: 'input',
                value: 'Ю',
                caption: 'Ю',
            },
            {
                type: 'input',
                value: 'Ъ',
                caption: 'Ъ',
            },
        ],
        lastRow,
    ],
    RuDown: [
        [
            {
                type: 'input',
                value: 'й',
                caption: 'й',
            },
            {
                type: 'input',
                value: 'ц',
                caption: 'ц',
            },
            {
                type: 'input',
                value: 'у',
                caption: 'у',
            },
            {
                type: 'input',
                value: 'к',
                caption: 'к',
            },
            {
                type: 'input',
                value: 'е',
                caption: 'е',
            },
            {
                type: 'input',
                value: 'н',
                caption: 'н',
            },
            {
                type: 'input',
                value: 'г',
                caption: 'г',
            },
            {
                type: 'input',
                value: 'ш',
                caption: 'ш',
            },
            {
                type: 'input',
                value: 'щ',
                caption: 'щ',
            },
            {
                type: 'input',
                value: 'з',
                caption: 'з',
            },
            {
                type: 'input',
                value: 'х',
                caption: 'х',
            },
            {
                type: 'remove',
                value: 'backspace',
                contentTemplate: templatesOfButtons.backspaceButton,
            },
        ],
        [
            {
                type: 'input',
                value: 'ф',
                caption: 'ф',
                leftMarginModifier: leftMarginSecondRow,
            },
            {
                type: 'input',
                value: 'ы',
                caption: 'ы',
            },
            {
                type: 'input',
                value: 'в',
                caption: 'в',
            },
            {
                type: 'input',
                value: 'а',
                caption: 'а',
            },
            {
                type: 'input',
                value: 'п',
                caption: 'п',
            },
            {
                type: 'input',
                value: 'р',
                caption: 'р',
            },
            {
                type: 'input',
                value: 'о',
                caption: 'о',
            },
            {
                type: 'input',
                value: 'л',
                caption: 'л',
            },
            {
                type: 'input',
                value: 'д',
                caption: 'д',
            },
            {
                type: 'input',
                value: 'ж',
                caption: 'ж',
            },
            {
                type: 'input',
                value: 'э',
                caption: 'э',
            },
        ],
        [
            {
                type: 'action',
                value: 'shift',
                contentTemplate: templatesOfButtons.shiftButton,
                widthModifier: shiftWidthModifier,
            },
            {
                type: 'input',
                value: 'я',
                caption: 'я',
            },
            {
                type: 'input',
                value: 'ч',
                caption: 'ч',
            },
            {
                type: 'input',
                value: 'с',
                caption: 'с',
            },
            {
                type: 'input',
                value: 'м',
                caption: 'м',
            },
            {
                type: 'input',
                value: 'и',
                caption: 'и',
            },
            {
                type: 'input',
                value: 'т',
                caption: 'т',
            },
            {
                type: 'input',
                value: 'ь',
                caption: 'ь',
            },
            {
                type: 'input',
                value: 'б',
                caption: 'б',
            },
            {
                type: 'input',
                value: 'ю',
                caption: 'ю',
            },
            {
                type: 'input',
                value: 'ъ',
                caption: 'ъ',
            },
        ],
        lastRow,
    ],
    EnUp: [
        [
            {
                type: 'input',
                value: 'Q',
                caption: 'Q',
            },
            {
                type: 'input',
                value: 'W',
                caption: 'W',
            },
            {
                type: 'input',
                value: 'E',
                caption: 'E',
            },
            {
                type: 'input',
                value: 'R',
                caption: 'R',
            },
            {
                type: 'input',
                value: 'T',
                caption: 'T',
            },
            {
                type: 'input',
                value: 'Y',
                caption: 'Y',
            },
            {
                type: 'input',
                value: 'U',
                caption: 'U',
            },
            {
                type: 'input',
                value: 'I',
                caption: 'I',
            },
            {
                type: 'input',
                value: 'O',
                caption: 'O',
            },
            {
                type: 'input',
                value: 'P',
                caption: 'P',
            },
            {
                type: 'input',
                value: '-',
                caption: '-',
            },
            {
                type: 'remove',
                value: 'backspace',
                contentTemplate: templatesOfButtons.backspaceButton,
            },
        ],
        [
            {
                type: 'input',
                value: 'A',
                caption: 'A',
                leftMarginModifier: leftMarginSecondRow,
            },
            {
                type: 'input',
                value: 'S',
                caption: 'S',
            },
            {
                type: 'input',
                value: 'D',
                caption: 'D',
            },
            {
                type: 'input',
                value: 'F',
                caption: 'F',
            },
            {
                type: 'input',
                value: 'G',
                caption: 'G',
            },
            {
                type: 'input',
                value: 'H',
                caption: 'H',
            },
            {
                type: 'input',
                value: 'J',
                caption: 'J',
            },
            {
                type: 'input',
                value: 'K',
                caption: 'K',
            },
            {
                type: 'input',
                value: 'L',
                caption: 'L',
            },
            {
                type: 'input',
                value: '/',
                caption: '/',
            },
            {
                type: 'input',
                value: '@',
                caption: '@',
            },
        ],
        [
            {
                type: 'action',
                value: 'shift',
                contentTemplate: templatesOfButtons.shiftButton,
                widthModifier: shiftWidthModifier,
            },
            {
                type: 'input',
                value: 'Z',
                caption: 'Z',
            },
            {
                type: 'input',
                value: 'X',
                caption: 'X',
            },
            {
                type: 'input',
                value: 'C',
                caption: 'C',
            },
            {
                type: 'input',
                value: 'V',
                caption: 'V',
            },
            {
                type: 'input',
                value: 'B',
                caption: 'B',
            },
            {
                type: 'input',
                value: 'N',
                caption: 'N',
            },
            {
                type: 'input',
                value: 'M',
                caption: 'M',
            },
            {
                type: 'input',
                value: ',',
                caption: ',',
            },
            {
                type: 'input',
                value: '.',
                caption: '.',
            },
            {
                type: 'input',
                value: "'",
                caption: "'",
            },
        ],
        lastRow,
    ],
    EnDown: [
        [
            {
                type: 'input',
                value: 'q',
                caption: 'q',
            },
            {
                type: 'input',
                value: 'w',
                caption: 'w',
            },
            {
                type: 'input',
                value: 'e',
                caption: 'e',
            },
            {
                type: 'input',
                value: 'r',
                caption: 'r',
            },
            {
                type: 'input',
                value: 't',
                caption: 't',
            },
            {
                type: 'input',
                value: 'y',
                caption: 'y',
            },
            {
                type: 'input',
                value: 'u',
                caption: 'u',
            },
            {
                type: 'input',
                value: 'i',
                caption: 'i',
            },
            {
                type: 'input',
                value: 'o',
                caption: 'o',
            },
            {
                type: 'input',
                value: 'p',
                caption: 'p',
            },
            {
                type: 'input',
                value: '-',
                caption: '-',
            },
            {
                type: 'remove',
                value: 'backspace',
                contentTemplate: templatesOfButtons.backspaceButton,
            },
        ],
        [
            {
                type: 'input',
                value: 'a',
                caption: 'a',
                leftMarginModifier: leftMarginSecondRow,
            },
            {
                type: 'input',
                value: 's',
                caption: 's',
            },
            {
                type: 'input',
                value: 'd',
                caption: 'd',
            },
            {
                type: 'input',
                value: 'f',
                caption: 'f',
            },
            {
                type: 'input',
                value: 'g',
                caption: 'g',
            },
            {
                type: 'input',
                value: 'h',
                caption: 'h',
            },
            {
                type: 'input',
                value: 'j',
                caption: 'j',
            },
            {
                type: 'input',
                value: 'k',
                caption: 'k',
            },
            {
                type: 'input',
                value: 'l',
                caption: 'l',
            },
            {
                type: 'input',
                value: '/',
                caption: '/',
            },
            {
                type: 'input',
                value: '@',
                caption: '@',
            },
        ],
        [
            {
                type: 'action',
                value: 'shift',
                contentTemplate: templatesOfButtons.shiftButton,
                widthModifier: shiftWidthModifier,
            },
            {
                type: 'input',
                value: 'z',
                caption: 'z',
            },
            {
                type: 'input',
                value: 'x',
                caption: 'x',
            },
            {
                type: 'input',
                value: 'c',
                caption: 'c',
            },
            {
                type: 'input',
                value: 'v',
                caption: 'v',
            },
            {
                type: 'input',
                value: 'b',
                caption: 'b',
            },
            {
                type: 'input',
                value: 'n',
                caption: 'n',
            },
            {
                type: 'input',
                value: 'm',
                caption: 'm',
            },
            {
                type: 'input',
                value: ',',
                caption: ',',
            },
            {
                type: 'input',
                value: '.',
                caption: '.',
            },
            {
                type: 'input',
                value: "'",
                caption: "'",
            },
        ],
        lastRow,
    ],
    Symbols: [
        [
            {
                type: 'input',
                value: '1',
                caption: '1',
            },
            {
                type: 'input',
                value: '2',
                caption: '2',
            },
            {
                type: 'input',
                value: '3',
                caption: '3',
            },
            {
                type: 'input',
                value: '4',
                caption: '4',
            },
            {
                type: 'input',
                value: '5',
                caption: '5',
            },
            {
                type: 'input',
                value: '6',
                caption: '6',
            },
            {
                type: 'input',
                value: '7',
                caption: '7',
            },
            {
                type: 'input',
                value: '8',
                caption: '8',
            },
            {
                type: 'input',
                value: '9',
                caption: '9',
            },
            {
                type: 'input',
                value: '0',
                caption: '0',
            },
            {
                type: 'input',
                value: '-',
                caption: '-',
            },
            {
                type: 'remove',
                value: 'backspace',
                contentTemplate: templatesOfButtons.backspaceButton,
            },
        ],
        [
            {
                type: 'input',
                value: '\\',
                caption: '\\',
                leftMarginModifier: leftMarginSecondRow,
            },
            {
                type: 'input',
                value: '*',
                caption: '*',
            },
            {
                type: 'input',
                value: '№',
                caption: '№',
            },
            {
                type: 'input',
                value: '#',
                caption: '#',
            },
            {
                type: 'input',
                value: '&',
                caption: '&',
            },
            {
                type: 'input',
                value: '(',
                caption: '(',
            },
            {
                type: 'input',
                value: ')',
                caption: ')',
            },
            {
                type: 'input',
                value: ':',
                caption: ':',
            },
            {
                type: 'input',
                value: ';',
                caption: ';',
            },
            {
                type: 'input',
                value: '/',
                caption: '/',
            },
            {
                type: 'input',
                value: '@',
                caption: '@',
            },
        ],
        [
            {
                type: 'input',
                value: '~',
                caption: '~',
                leftMarginModifier: leftMarginThirdRow,
            },
            {
                type: 'input',
                value: '%',
                caption: '%',
            },
            {
                type: 'input',
                value: '_',
                caption: '_',
            },
            {
                type: 'input',
                value: '+',
                caption: '+',
            },
            {
                type: 'input',
                value: '=',
                caption: '=',
            },
            {
                type: 'input',
                value: '"',
                caption: '"',
            },
            {
                type: 'input',
                value: '?',
                caption: '?',
            },
            {
                type: 'input',
                value: '!',
                caption: '!',
            },
            {
                type: 'input',
                value: ',',
                caption: ',',
            },
            {
                type: 'input',
                value: '.',
                caption: '.',
            },
            {
                type: 'input',
                value: "'",
                caption: "'",
            },
        ],
        lastRow,
    ],
};

export { defaultOptions, allItems, Langs };
