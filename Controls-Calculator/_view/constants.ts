import { IKeyboardItem } from 'Controls-Keyboard/View';

/**
 * Константы для калькулятора
 * @singleton
 * @private
 */

export const DIVISION_BY_ZERO_EXCEPTION = 'Деление на ноль невозможно';

/*
 * Константы кнопок
 */
export const BUTTONS = {
    POINT: '.',
    ZERO: '0',
    DOUBLE_ZERO: '00',
    ADDITION: '+',
    SUBTRACTION: '-',
    MULTIPLICATION: '*',
    DIVISION: '/',
    NEGATE: 'negate',
    CLEAR: 'clear',
    CLEAR_ALL: 'allClean',
    ADD_TO_MEMORY: 'addToMemory',
    SUBTRACT_FROM_MEMORY: 'subtractFromMemory',
    MEMORY_RECALL: 'memoryRecall',
    MEMORY_CLEAR: 'memoryClear',
    MEMORY_SAVE: 'memorySave',
    BACKSPACE: 'backspace',
    PERCENT: 'percent',
    EQUALS: 'equals',
};

export const ERROR_MAP = {
    'Division by zero': DIVISION_BY_ZERO_EXCEPTION,
};

/*
 * Описание типов для различных кнопок
 */
export type IOperandSymbol = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.';
export type IOperator = '+' | '-' | '*' | '/';
export type IMemoryOperator = 'memoryRecall' | 'memoryClear' | 'addToMemory' | 'subtractFromMemory';
export type IClearOperator = 'clear' | 'clearAll';
export type INegateOperator = 'negate';
export type IPercentOperator = 'percent';
export type IEqualsOperator = 'equals';
export type IKey =
    | IOperandSymbol
    | IOperator
    | IMemoryOperator
    | IClearOperator
    | INegateOperator
    | IPercentOperator
    | IEqualsOperator;

/*
 * Мапа операторов и кнопок
 */
const OperatorMap = {};

OperatorMap[BUTTONS.ADDITION] = 'add';
OperatorMap[BUTTONS.SUBTRACTION] = 'sub';
OperatorMap[BUTTONS.DIVISION] = 'div';
OperatorMap[BUTTONS.MULTIPLICATION] = 'mul';

export { OperatorMap };

/*
 * Описание кнопок для виртуальной клавиатуры
 */
const ZERO: IKeyboardItem = {
    type: 'input',
    value: '0',
    caption: '0',
};
const ONE: IKeyboardItem = {
    type: 'input',
    value: '1',
    caption: '1',
};
const TWO: IKeyboardItem = {
    type: 'input',
    value: '2',
    caption: '2',
};
const THREE: IKeyboardItem = {
    type: 'input',
    value: '3',
    caption: '3',
};
const FOUR: IKeyboardItem = {
    type: 'input',
    value: '4',
    caption: '4',
};
const FIVE: IKeyboardItem = {
    type: 'input',
    value: '5',
    caption: '5',
};
const SIX: IKeyboardItem = {
    type: 'input',
    value: '6',
    caption: '6',
};
const SEVEN: IKeyboardItem = {
    type: 'input',
    value: '7',
    caption: '7',
};
const EIGHT: IKeyboardItem = {
    type: 'input',
    value: '8',
    caption: '8',
};
const NINE: IKeyboardItem = {
    type: 'input',
    value: '9',
    caption: '9',
};

const DIVISION: IKeyboardItem = {
    type: 'action',
    value: '/',
    icon: 'icon-Division',
    iconSize: 'm',
};
const MULTIPLICATION: IKeyboardItem = {
    type: 'action',
    value: '*',
    icon: 'icon-Multiplication',
    iconSize: 'm',
};
const SUBTRACTION: IKeyboardItem = {
    type: 'action',
    value: '-',
    icon: 'icon-Subtraction',
    iconSize: 'm',
};
const ADDITION: IKeyboardItem = {
    type: 'action',
    value: '+',
    icon: 'icon-Addition',
    iconSize: 'm',
};
const EQUALS: IKeyboardItem = {
    type: 'mainAction',
    value: 'equals',
    icon: 'icon-Equally',
    iconSize: 'm',
};
const POINT: IKeyboardItem = {
    type: 'action',
    value: '.',
    caption: '.',
};
const BACKSPACE: IKeyboardItem = {
    type: 'action',
    value: 'backspace',
    icon: 'icon-Erase1',
    iconSize: 'm',
};
export const CLEAR: IKeyboardItem = {
    type: 'action',
    value: 'clear',
    caption: 'C',
};
const PERCENT: IKeyboardItem = {
    type: 'action',
    value: 'percent',
    icon: 'icon-Percent',
    iconSize: 'm',
};
const NEGATE: IKeyboardItem = {
    type: 'action',
    value: 'negate',
    icon: 'icon-SignChange',
    iconSize: 'm',
};
const DOUBLE_ZERO: IKeyboardItem = {
    type: 'input',
    value: '00',
    caption: '00',
};
const CLEAR_ALL: IKeyboardItem = {
    type: 'action',
    value: 'allClean',
    caption: 'AC',
};
const MEMORY_CLEAR = {
    type: 'action',
    value: 'memoryClear',
    caption: 'MC',
};
const MEMORY_RECALL = {
    type: 'action',
    value: 'memoryRecall',
    caption: 'MR',
};
const ADD_TO_MEMORY = {
    type: 'action',
    value: 'addToMemory',
    caption: 'M+',
};
const SUBSTRACT_FROM_MEMORY = {
    type: 'action',
    value: 'subtractFromMemory',
    caption: 'M-',
};
const SAVE_TO_MEMORY = {
    type: 'action',
    value: BUTTONS.MEMORY_SAVE,
    caption: 'MS',
};

/*
 * Мапа соответствия кнопок виртуальной клавиатуры и символов
 */
export const KEY_SYMBOLS = {
    // Левая клавиатура
    backspace: BACKSPACE,
    0: ZERO,
    1: ONE,
    2: TWO,
    3: THREE,
    4: FOUR,
    5: FIVE,
    6: SIX,
    7: SEVEN,
    8: EIGHT,
    9: NINE,
    '+': ADDITION,
    '-': SUBTRACTION,
    '*': MULTIPLICATION,
    '/': DIVISION,
    '%': PERCENT,
    '=': EQUALS,
    '.': POINT,
    ',': POINT,
    enter: EQUALS,
    delete: CLEAR,
};

/*
 * Мапа соответствия кнопок виртуальной клавиатуры и символов (ie)
 */
export const ALTERNATIVE_KEY_SYMBOLS = {
    divide: '/',
    multiply: '*',
    subtract: '-',
    add: '+',
    decimal: '.',
    del: 'delete',
};

export const TOGGLED_KEY_SYMBOLS = ['+', '-', '/', '*'];

/*
 * Стандартный набор для клавиатуры
 */
export const keyboardButtons: IKeyboardItem[][] = [
    [CLEAR, NEGATE, PERCENT, DIVISION],
    [SEVEN, EIGHT, NINE, MULTIPLICATION],
    [FOUR, FIVE, SIX, SUBTRACTION],
    [ONE, TWO, THREE, ADDITION],
    [ZERO, POINT, BACKSPACE, EQUALS],
];

const inputButtons = [
    ONE.value,
    TWO.value,
    THREE.value,
    FOUR.value,
    FIVE.value,
    SIX.value,
    SEVEN.value,
    EIGHT.value,
    NINE.value,
    ZERO.value,
    DOUBLE_ZERO.value,
    CLEAR.value,
    CLEAR_ALL.value,
    BACKSPACE.value,
    POINT.value,
];

/*
 * Стандартный набор для клавиатуры с кнопкой очистить все
 */
export const buttonsWithAC: IKeyboardItem[][] = keyboardButtons.map((arr) => {
    return arr.slice();
});

export const errorButtons = keyboardButtons.map((arr) => {
    return arr.map((item) => {
        const newItem = { ...item };

        if (!inputButtons.includes(newItem.value)) {
            newItem.readOnly = true;
        }

        return newItem;
    });
});
buttonsWithAC[0][0] = CLEAR_ALL;

/*
 * Расширенный набор для клавиатуры с клавишами для работы с памятью
 */
export const extendedKeyboardButtons = keyboardButtons.map((arr) => {
    return arr.slice();
});

[MEMORY_CLEAR, MEMORY_RECALL, ADD_TO_MEMORY, SUBSTRACT_FROM_MEMORY, SAVE_TO_MEMORY].forEach(
    (value, index) => {
        extendedKeyboardButtons[index].unshift(value);
    }
);

/*
 * Расширенный набор для клавиатуры с клавишами для работы с памятью и кнопкой очистить все
 */
export const extendedButtonsWithAC = extendedKeyboardButtons.map((arr) => {
    return arr.slice();
});

export const extendedErrorButtons = extendedKeyboardButtons.map((arr) => {
    return arr.map((item) => {
        const newItem = { ...item };

        if (!inputButtons.includes(newItem.value)) {
            newItem.readOnly = true;
        }

        return newItem;
    });
});

extendedButtonsWithAC[0][1] = CLEAR_ALL;
/*
 * Константа для истории в sessionStorage
 */
export const SESSION_STORAGE_HISTORY_PARAM = 'calculationHistory';
