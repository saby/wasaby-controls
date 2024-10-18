import * as QwertyHelper from 'Controls-Keyboard/QwertyHelper';
import { constants } from 'Env/Env';

const fakeInput = {
    scrollWidth: 20,
    offsetWidth: 40,
    value: 'Привет',
    selectionStart: 6,
    scrollLeft: 0,
};

describe('Controls-Keyboard/QwertyHelper:changeStringAfterClick', () => {
    it('Добавление символа к концу строки', () => {
        const stringForTest = 'Приве';
        const pressingButton = 'т';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: stringForTest.length,
        };

        const result = 'Привет';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: result.length,
            },
        };

        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Удаление последнего символа', () => {
        const stringForTest = 'Привет';
        const pressingButton = 'backspace';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: stringForTest.length,
        };
        const result = 'Приве';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: result.length,
            },
        };

        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Вставка символа в середине строки', () => {
        const stringForTest = 'Приет';
        const pressingButton = 'в';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: 3,
        };
        const result = 'Привет';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: 4,
            },
        };
        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Удаление символа в середине строки', () => {
        const stringForTest = 'Привет';
        const pressingButton = 'backspace';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: 4,
        };
        const result = 'Приет';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: 3,
            },
        };

        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Удаление символа, при положении каретки в начальной позиции', () => {
        const stringForTest = 'Привет';
        const pressingButton = 'backspace';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: 0,
        };
        const result = 'Приве';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: -1,
            },
        };
        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Добавление символа при выделенном фрагменте строки', () => {
        const stringForTest = 'Приве';
        const pressingButton = 'т';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 2,
            selectionStart: 3,
        };

        const result = 'Прит';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: result.length,
            },
        };

        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Удаление выделенного фрагмента строки', () => {
        const stringForTest = 'Привет';
        const pressingButton = 'backspace';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 2,
            selectionStart: 4,
        };
        const result = 'Прив';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: result.length,
            },
        };

        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Добавление символа при выделенном фрагменте строки в середине', () => {
        const stringForTest = 'Присет';
        const pressingButton = 'в';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 1,
            selectionStart: 3,
        };
        const result = 'Привет';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: 4,
            },
        };
        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });

    it('Удаление выделенного фрагмента строки с конца', () => {
        const stringForTest = 'Приветик';
        const pressingButton = 'backspace';
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 2,
            selectionStart: 6,
        };
        const result = 'Привет';
        const changeString: QwertyHelper.IChangeString = {
            resultStr: result,
            usingPositions: {
                length: 0,
                selectionStart: result.length,
            },
        };

        const { resultStr, usingPositions } = QwertyHelper.changeStringAfterClick(
            stringForTest,
            pressingButton,
            positionOfCaret
        );

        expect(resultStr).toEqual(changeString.resultStr);
        expect(usingPositions.length).toEqual(changeString.usingPositions.length);
        expect(usingPositions.selectionStart).toEqual(changeString.usingPositions.selectionStart);
    });
});

describe('Controls-Keyboard/QwertyHelper:choosePositionsOfCaret', () => {
    it('Положение каретки при вводе символа в пустую строку', () => {
        const isSymbol = true;
        const lenStrInInput = 1;
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = null;

        const resultPosition: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: lenStrInInput,
        };

        const { length, selectionStart } = QwertyHelper.choosePositionsOfCaret(
            isSymbol,
            positionOfCaret,
            lenStrInInput
        );

        expect(length).toEqual(resultPosition.length);
        expect(selectionStart).toEqual(resultPosition.selectionStart);
    });

    it('Положение каретки при удаления символа', () => {
        const isSymbol = false;
        const lenStrInInput = 1;
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = null;

        const resultPosition: QwertyHelper.IPositionsOfCaret = {
            length: 1,
            selectionStart: 0,
        };

        const { length, selectionStart } = QwertyHelper.choosePositionsOfCaret(
            isSymbol,
            positionOfCaret,
            lenStrInInput
        );

        expect(length).toEqual(resultPosition.length);
        expect(selectionStart).toEqual(resultPosition.selectionStart);
    });

    it('Положение каретки при удалении символа при наличии исходной позиции картетки', () => {
        const isSymbol = false;
        const lenStrInInput = 3;
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 0,
            selectionStart: lenStrInInput,
        };

        const resultPosition: QwertyHelper.IPositionsOfCaret = {
            length: 1,
            selectionStart: 2,
        };

        const { length, selectionStart } = QwertyHelper.choosePositionsOfCaret(
            isSymbol,
            positionOfCaret,
            lenStrInInput
        );

        expect(length).toEqual(resultPosition.length);
        expect(selectionStart).toEqual(resultPosition.selectionStart);
    });

    it('Положение каретки при вводе символа и наличии исходной позиции картетки', () => {
        const isSymbol = true;
        const lenStrInInput = 5;
        const positionOfCaret: QwertyHelper.IPositionsOfCaret = {
            length: 3,
            selectionStart: 3,
        };

        const resultPosition: QwertyHelper.IPositionsOfCaret = {
            length: 3,
            selectionStart: 3,
        };

        const { length, selectionStart } = QwertyHelper.choosePositionsOfCaret(
            isSymbol,
            positionOfCaret,
            lenStrInInput
        );

        expect(length).toEqual(resultPosition.length);
        expect(selectionStart).toEqual(resultPosition.selectionStart);
    });
});

describe('Controls-Keyboard/QwertyHelper:getScrollLeft', () => {
    it('Величина скролла при ширине текста меньше ширины поля ввода', () => {
        const scrollLeft = QwertyHelper.getScrollLeft(fakeInput as HTMLInputElement);
        const needScroll = 0;
        expect(scrollLeft).toEqual(needScroll);
    });

    it('Величина скролла при вводе в конце строки', () => {
        const needScroll = 60;
        fakeInput.scrollWidth = needScroll;
        const scrollLeft = QwertyHelper.getScrollLeft(fakeInput as HTMLInputElement);
        expect(scrollLeft).toEqual(needScroll);
    });

    // В следующих кейсах используется утилита getTextWidth, для которой необходим document
    if (!constants.isBrowserPlatform) {
        return;
    }

    it('Величина скролла при вводе в произвольной части строки', () => {
        fakeInput.value = 'А тут у нас будет побольше текст';
        const position = 15;
        fakeInput.selectionStart = position;
        const needScroll = 70;
        const scrollLeft = QwertyHelper.getScrollLeft(fakeInput as HTMLInputElement);
        expect(scrollLeft).toEqual(needScroll);
    });

    it('Величина скролла при вводе в начальной части строки ', () => {
        fakeInput.value = 'А тут у нас будет побольше текст';
        const position = 3;
        fakeInput.selectionStart = position;
        const needScroll = 0;
        const scrollLeft = QwertyHelper.getScrollLeft(fakeInput as HTMLInputElement);
        expect(scrollLeft).toEqual(needScroll);
    });
});
