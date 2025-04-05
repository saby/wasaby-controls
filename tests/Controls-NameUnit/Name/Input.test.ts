import { default as Input } from 'Controls-Name/_input/Input';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import Constants from 'Controls-Name/_input/constants';
import { TextViewModel } from 'Controls/input';
import { createSandbox } from 'sinon';
import { IInputOptions } from 'Controls-Name/_input/interface/IInput';
import { getProxyClass } from 'ControlsUnit/Utils/ProxyClass';

const arrEn = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];
const arrEN = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
const arrRu = [
    'а',
    'б',
    'в',
    'г',
    'д',
    'е',
    'ё',
    'ж',
    'з',
    'и',
    'й',
    'к',
    'л',
    'м',
    'н',
    'о',
    'п',
    'р',
    'с',
    'т',
    'у',
    'ф',
    'х',
    'ц',
    'ч',
    'ш',
    'щ',
    'ь',
    'ы',
    'ъ',
    'э',
    'ю',
    'я',
];
const arrRU = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Ё',
    'Ж',
    'З',
    'И',
    'Й',
    'К',
    'Л',
    'М',
    'Н',
    'О',
    'П',
    'Р',
    'С',
    'Т',
    'У',
    'Ф',
    'Х',
    'Ц',
    'Ч',
    'Ш',
    'Щ',
    'Ь',
    'Ы',
    'Ъ',
    'Э',
    'Ю',
    'Я',
];
const arrNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const arrSymb = ['!', '@', '#', '$', '%', '&', '?', '+', '=', '~'];

describe('Controls-Name/_input/Input', () => {
    it('inputConstraint', () => {
        arrEn.forEach((letter) => {
            expect(Input._inputConstraint(letter)).toBe(true);
        });
        arrEN.forEach((letter) => {
            expect(Input._inputConstraint(letter)).toBe(true);
        });
        arrRu.forEach((letter) => {
            expect(Input._inputConstraint(letter)).toBe(true);
        });
        arrRU.forEach((letter) => {
            expect(Input._inputConstraint(letter)).toBe(true);
        });
        expect(Input._inputConstraint("'")).toBe(true);
        expect(Input._inputConstraint('-')).toBe(true);
        expect(Input._inputConstraint(',')).toBe(true);
        expect(Input._inputConstraint('.')).toBe(true);

        arrNum.forEach((letter) => {
            expect(Input._inputConstraint(letter)).toBe(true);
        });
        arrSymb.forEach((letter) => {
            expect(Input._inputConstraint(letter)).toBe(true);
        });
    });

    it('_preparePasteValue', () => {
        expect(Input._preparePasteValue('')).toEqual('');
        expect(Input._preparePasteValue('Фамилия1 Имя2 Отчество3')).toEqual(
            'Фамилия1 Имя2 Отчество3'
        );
        expect(Input._preparePasteValue('Фамилия\tИмя\tОтчество')).toEqual('Фамилия Имя Отчество');
        expect(Input._preparePasteValue('Фамилия\nИмя\nОтчество')).toEqual('Фамилия Имя Отчество');
    });

    it('_filterInputValue', () => {
        expect(Input._filterInputValue('')).toEqual('');
        expect(Input._filterInputValue('Фамилия1-!@#$%^&*()_=+ ')).toEqual(
            'Фамилия1-!@#$%^&*()_=+ '
        );
    });

    it('_updateValueAfterPaste', () => {
        const input = getProxyClass(Input);
        const sandbox = createSandbox();
        sandbox.replace(input, '_getTextWidth', (text) => {
            return text.length;
        });

        // вставка трёх полей
        let inputOrder = ['lastName', 'firstName', 'middleName'];
        let inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, '') },
                { id: 'firstName', model: new TextViewModel({}, '') },
                { id: 'middleName', model: new TextViewModel({}, '') },
            ],
            keyProperty: 'id',
        });
        let pasteRecord = new Record({
            rawData: {
                lastName: 'lastName',
                firstName: 'firstName',
                middleName: 'middleName',
                order: inputOrder,
            },
        });
        const checkModelValues = (msg: string) => {
            inputOrder.forEach((field) => {
                const fieldRec = inputs.getRecordById(field);
                expect(fieldRec).toBeTruthy();
                if (pasteRecord.get(field) !== undefined) {
                    expect(fieldRec.get('model').displayValue).toEqual(pasteRecord.get(field));
                }
            });
        };
        let changedInput = input.proxy('_updateValueAfterPaste', pasteRecord, inputs, inputOrder);
        expect(changedInput).toEqual('middleName');
        checkModelValues('Проверка 1');

        // изменим порядок
        inputOrder = ['lastName', 'middleName', 'firstName'];
        inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, '') },
                { id: 'firstName', model: new TextViewModel({}, '') },
                { id: 'middleName', model: new TextViewModel({}, '') },
            ],
            keyProperty: 'id',
        });
        changedInput = input.proxy('_updateValueAfterPaste', pasteRecord, inputs, inputOrder);
        expect(changedInput).toEqual('firstName');
        checkModelValues('проверка с другим следованием разделов');

        // вставка одного поля
        inputOrder = ['lastName', 'firstName', 'middleName'];
        inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, '') },
                { id: 'firstName', model: new TextViewModel({}, '') },
                { id: 'middleName', model: new TextViewModel({}, '') },
            ],
            keyProperty: 'id',
        });
        pasteRecord = new Record({
            rawData: {
                lastName: 'lastName',
                firstName: '',
                middleName: '',
                order: inputOrder,
            },
        });
        changedInput = input.proxy('_updateValueAfterPaste', pasteRecord, inputs, inputOrder);
        expect(changedInput).toEqual('lastName');
        checkModelValues('вставка одного поля');

        // вставка одного поля другие не определены
        inputOrder = ['lastName', 'firstName', 'middleName'];
        inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, '') },
                { id: 'firstName', model: new TextViewModel({}, '') },
                { id: 'middleName', model: new TextViewModel({}, '') },
            ],
            keyProperty: 'id',
        });
        pasteRecord = new Record({
            rawData: {
                lastName: 'lastName',
                order: inputOrder,
            },
        });
        changedInput = input.proxy('_updateValueAfterPaste', pasteRecord, inputs, inputOrder);
        expect(changedInput).toEqual('lastName');
        checkModelValues('вставка одного поля другие не определены');
        sandbox.restore();
    });

    it('_initViewModel()', () => {
        const input = getProxyClass(Input);
        let options = {
            fields: ['firstName', 'middleName', 'lastName'],
            value: {
                firstName: 'firstName',
                middleName: 'middleName',
                lastName: 'lastName',
            },
        };
        input.proxy('_initViewModel', options);
        expect(input.proxyState('_inputs').getCount()).toEqual(3);
        options.fields.forEach((field) => {
            const fieldRec = input.proxyState('_inputs').getRecordById(field);
            expect(fieldRec).toBeTruthy();
            expect(fieldRec.get('model').displayValue).toEqual(options.value[field]);
        });

        options = {
            fields: ['firstName', 'lastName'],
            value: {
                firstName: 'firstName',
                middleName: 'middleName',
                lastName: 'lastName',
            },
        };
        input.proxy('_initViewModel', options);
        expect(input.proxyState('_inputs').getCount()).toEqual(2);
        options.fields.forEach((field) => {
            const fieldRec = input.proxyState('_inputs').getRecordById(field);
            expect(fieldRec).toBeTruthy();
            expect(fieldRec.get('model').displayValue).toEqual(options.value[field]);
        });
    });

    it('_separatorHoverHandler', () => {
        const input = getProxyClass(Input);
        const options = {
            fields: ['firstName', 'middleName', 'lastName'],
            value: {
                firstName: 'firstName',
                middleName: 'middleName',
                lastName: 'lastName',
            },
        };
        const resetMarked = (inputs) => {
            inputs.each((rec) => {
                rec.set('marked', false);
            });
        };
        const event = {};
        input.proxy('_initViewModel', options);
        resetMarked(input.proxyState('_inputs'));
        // edit mode
        input.proxyState('_options').readonly = false;
        input.proxyState('_inputs').at(0).set('marked', true);
        input.proxy('_separatorHoverHandler', event, input.proxyState('_inputs').at(2), true);
        expect(input.proxyState('_inputs').at(0).get('marked')).toBe(false);
        expect(input.proxyState('_inputs').at(1).get('marked')).toBe(false);
        expect(input.proxyState('_inputs').at(2).get('marked')).toBe(true);
        resetMarked(input.proxyState('_inputs'));
        input.proxyState('_inputs').at(0).set('marked', true);
        input.proxy('_separatorHoverHandler', event, input.proxyState('_inputs').at(0), false);
        expect(input.proxyState('_inputs').at(0).get('marked')).toBe(false);
        resetMarked(input.proxyState('_inputs'));
        // readonly mode
        input.proxyState('_options').readonly = true;
        input.proxyState('_inputs').at(0).set('marked', true);
        input.proxy('_separatorHoverHandler', event, input.proxyState('_inputs').at(2), true);
        expect(input.proxyState('_inputs').at(0).get('marked')).toBe(false);
        expect(input.proxyState('_inputs').at(1).get('marked')).toBe(false);
        expect(input.proxyState('_inputs').at(2).get('marked')).toBe(true);
        resetMarked(input.proxyState('_inputs'));
        input.proxyState('_inputs').at(0).set('marked', true);
        input.proxy('_separatorHoverHandler', event, input.proxyState('_inputs').at(0), false);
        expect(input.proxyState('_inputs').at(0).get('marked')).toBe(false);
        resetMarked(input.proxyState('_inputs'));
    });

    it('_prepareInputOrderString()', () => {
        expect(Input._prepareInputOrderString(['lastName', 'firstName', 'middleName'])).toEqual(
            'Фамилия Имя Отчество'
        );
        expect(Input._prepareInputOrderString(['lastName', 'middleName', 'firstName'])).toEqual(
            'Фамилия Отчество Имя'
        );
        expect(Input._prepareInputOrderString(['firstName', 'lastName', 'middleName'])).toEqual(
            'Имя Фамилия Отчество'
        );
    });

    it('_getNextInput()', () => {
        expect(Input._getNextInput(['lastName', 'firstName', 'middleName'], 'lastName')).toEqual(
            'firstName'
        );
        expect(Input._getNextInput(['lastName', 'firstName', 'middleName'], 'firstName')).toEqual(
            'middleName'
        );
        expect(Input._getNextInput(['lastName', 'firstName', 'middleName'], 'middleName')).toEqual(
            'middleName'
        );
        expect(Input._getNextInput(['lastName', 'middleName', 'firstName'], 'lastName')).toEqual(
            'middleName'
        );
        expect(Input._getNextInput(['lastName', 'middleName', 'firstName'], 'middleName')).toEqual(
            'firstName'
        );
        expect(Input._getNextInput(['lastName', 'middleName', 'firstName'], 'firstName')).toEqual(
            'firstName'
        );
        expect(Input._getNextInput(['firstName', 'lastName', 'middleName'], 'firstName')).toEqual(
            'lastName'
        );
        expect(Input._getNextInput(['firstName', 'lastName', 'middleName'], 'lastName')).toEqual(
            'middleName'
        );
        expect(Input._getNextInput(['firstName', 'lastName', 'middleName'], 'middleName')).toEqual(
            'middleName'
        );
    });

    it('_updateInput()', () => {
        const input = getProxyClass(Input);
        const sandbox = createSandbox();
        sandbox.replace(input, '_getTextWidth', (text) => {
            return text.length * 10;
        });
        let record = new Record({
            rawData: {
                model: new TextViewModel({}, 'Aleksey'),
                width: 100,
            },
        });
        record = input.proxy('_updateInput', record, 'test');
        expect(record.get('width')).toEqual(40);
        expect(record.get('model').displayValue).toEqual('test');
        sandbox.restore();
    });

    it('_getSelection()', () => {
        const input = {
            selectionStart: 10,
            selectionEnd: 15,
        };
        expect(Input._getSelection(input as HTMLInputElement)).toEqual({
            start: 10,
            end: 15,
            length: 5,
        });
    });
    describe('_processKeyboard()', () => {
        it('not empty selection', () => {
            const input = getProxyClass(Input);
            const inputValue = '';
            const inputId = 'lastName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 0, end: 1, length: 1 },
                    keyCode: ' ',
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
        });
        it('space', () => {
            const input = getProxyClass(Input);
            const inputValue = 'test';
            let inputId = 'lastName';
            input.saveOptions({
                inputOrder: ['lastName', 'firstName', 'middleName'],
            } as IInputOptions);
            input.proxy('_initViewModel', {
                fields: ['lastName', 'firstName', 'middleName'],
                value: { lastName: 'test' },
            });
            const keyCode = Constants.KEY_CODES.Space;
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'firstName',
                position: 'start',
                preventDefault: true,
            });
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 2, end: 2, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            inputId = 'middleName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            input.saveOptions({
                inputOrder: ['firstName', 'lastName', 'middleName'],
            } as IInputOptions);
            inputId = 'firstName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
        });
        it('Home, End', () => {
            const input = getProxyClass(Input);
            let inputId = 'lastName';
            const inputValue = 'test';
            input.saveOptions({
                inputOrder: ['lastName', 'firstName', 'middleName'],
            } as IInputOptions);
            let keyCode = Constants.KEY_CODES.Home;
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'lastName',
                position: 'start',
                preventDefault: false,
            });
            inputId = 'middleName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'lastName',
                position: 'start',
                preventDefault: false,
            });
            inputId = 'lastName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    shiftKey: true,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            inputId = 'middleName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    shiftKey: true,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);

            keyCode = Constants.KEY_CODES.End;
            inputId = 'lastName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'middleName',
                position: 'end',
                preventDefault: false,
            });
            inputId = 'middleName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 0, end: 0, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'middleName',
                position: 'end',
                preventDefault: false,
            });
            inputId = 'lastName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    shiftKey: true,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            inputId = 'middleName';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 0, end: 0, length: 0 },
                    keyCode,
                    shiftKey: true,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
        });
        it('ArrowRight', () => {
            const input = getProxyClass(Input);
            let inputId = 'lastName';
            let inputValue = 'test';
            input.saveOptions({
                inputOrder: ['lastName', 'firstName', 'middleName'],
            } as IInputOptions);
            const keyCode = Constants.KEY_CODES.ArrowRight;
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 1, end: 1, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'firstName',
                position: 'start',
                preventDefault: true,
            });
            inputId = 'middleName';
            inputValue = 'test';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
        });
        it('ArrowLeft, Backspace', () => {
            const input = getProxyClass(Input);
            let inputId = 'lastName';
            let inputValue = 'test';
            input.saveOptions({
                inputOrder: ['lastName', 'firstName', 'middleName'],
            } as IInputOptions);
            let keyCode = Constants.KEY_CODES.ArrowLeft;
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 1, end: 1, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            inputId = 'middleName';
            inputValue = 'test';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 0, end: 0, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'firstName',
                position: 'end',
                preventDefault: true,
            });
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            keyCode = Constants.KEY_CODES.Backspace;
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 1, end: 1, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
            inputId = 'middleName';
            inputValue = 'test';
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 0, end: 0, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual({
                input: 'firstName',
                position: 'end',
                preventDefault: true,
            });
            expect(
                input.proxy('_processKeyboard', {
                    selection: { start: 4, end: 4, length: 0 },
                    keyCode,
                    inputValue,
                    inputId,
                })
            ).toEqual(null);
        });
    });
    it('_processDrag()', () => {
        const input = getProxyClass(Input);
        input.saveOptions({
            inputOrder: ['lastName', 'firstName', 'middleName'],
        } as IInputOptions);
        input.proxy('_initViewModel', {
            fields: ['lastName', 'firstName', 'middleName'],
            value: {
                lastName: 'test test',
                firstName: 'foo foo',
                middleName: 'bar bar bar',
            },
        });
        let currentDropPosition = {
            offset: 200,
            subStrBefore: 'bar',
            subStrAfter: 'bar bar',
            inputId: 'middleName',
            separator: null,
        };
        expect(input.proxy('_processDrag', 1, 2, currentDropPosition)).toEqual([
            {
                inputId: 'middleName',
                value: 'bar bar',
            },
            {
                inputId: 'firstName',
                value: 'foo foo bar',
            },
        ]);
        expect(input.proxy('_processDrag', 0, 2, currentDropPosition)).toEqual([]);
        currentDropPosition = {
            offset: 100,
            subStrBefore: 'test test',
            subStrAfter: '',
            inputId: 'lastName',
            separator: 1,
        };
        expect(input.proxy('_processDrag', 1, 0, currentDropPosition)).toEqual([
            {
                inputId: 'middleName',
                value: 'foo foo bar bar bar',
            },
            {
                inputId: 'firstName',
                value: '',
            },
        ]);
        currentDropPosition = {
            offset: 100,
            subStrBefore: 'foo',
            subStrAfter: 'foo',
            inputId: 'firstName',
            separator: null,
        };
        expect(input.proxy('_processDrag', 2, 1, currentDropPosition)).toEqual([]);
        expect(input.proxy('_processDrag', 1, 1, currentDropPosition)).toEqual([
            {
                inputId: 'firstName',
                value: 'foo',
            },
            {
                inputId: 'middleName',
                value: 'foo bar bar bar',
            },
        ]);
    });

    it('_calcPossibleDropPositions()', () => {
        const inputs = new RecordSet({
            rawData: [
                {
                    id: 'lastName',
                    model: new TextViewModel({}, 'test test'),
                    width: 90,
                },
                {
                    id: 'firstName',
                    model: new TextViewModel({}, 'foo foo'),
                    width: 70,
                },
            ],
            keyProperty: 'id',
        });
        const getTextWidth = (text) => {
            return text.length * 10;
        };
        expect(
            Input._calcPossibleDropPositions(
                ['firstName', 'lastName'],
                inputs,
                50, // separatorWidth
                getTextWidth
            )
        ).toEqual([
            {
                offset: 0,
                subStrBefore: '',
                subStrAfter: 'foo foo',
                inputId: 'firstName',
                separator: null,
            },
            {
                offset: 30,
                subStrBefore: 'foo',
                subStrAfter: 'foo',
                inputId: 'firstName',
                separator: null,
            },
            {
                offset: 70,
                subStrBefore: 'foo foo',
                subStrAfter: '',
                inputId: 'firstName',
                separator: 0,
            },
            {
                offset: 160,
                subStrBefore: 'test',
                subStrAfter: 'test',
                inputId: 'lastName',
                separator: null,
            },
            {
                offset: 210,
                subStrBefore: 'test test',
                subStrAfter: '',
                inputId: 'lastName',
                separator: 1,
            },
        ]);
    });
    it('_getSeparatorPosition()', () => {
        const input = getProxyClass(Input);
        const dropPositions = [
            {
                offset: 0,
                subStrBefore: '',
                subStrAfter: 'foo foo',
                inputId: 'firstName',
                separator: null,
            },
            {
                offset: 30,
                subStrBefore: 'foo',
                subStrAfter: 'foo',
                inputId: 'firstName',
                separator: null,
            },
            {
                offset: 70,
                subStrBefore: 'foo foo',
                subStrAfter: '',
                inputId: 'firstName',
                separator: 0,
            },
            {
                offset: 160,
                subStrBefore: 'test',
                subStrAfter: 'test',
                inputId: 'lastName',
                separator: null,
            },
            {
                offset: 210,
                subStrBefore: 'test test',
                subStrAfter: '',
                inputId: 'lastName',
                separator: 1,
            },
        ];
        expect(input.proxy('_getSeparatorPosition', 0, dropPositions)).toEqual(0);
        expect(input.proxy('_getSeparatorPosition', 10, dropPositions)).toEqual(0);
        expect(input.proxy('_getSeparatorPosition', 15, dropPositions)).toEqual(0);
        expect(input.proxy('_getSeparatorPosition', 20, dropPositions)).toEqual(1);
        expect(input.proxy('_getSeparatorPosition', 30, dropPositions)).toEqual(1);
        expect(input.proxy('_getSeparatorPosition', 55, dropPositions)).toEqual(2);
        expect(input.proxy('_getSeparatorPosition', 80, dropPositions)).toEqual(2);
        expect(input.proxy('_getSeparatorPosition', 150, dropPositions)).toEqual(3);
        expect(input.proxy('_getSeparatorPosition', 210, dropPositions)).toEqual(4);
    });

    it('_inputPaste()', () => {
        let input = {
            selectionStart: 2,
            selectionEnd: 5,
            value: 'тест_вставки',
        };
        expect(Input._inputPaste(input as HTMLInputElement, 'значение', 200)).toEqual(
            'тезначениевставки'
        );
        expect(input.value).toEqual('тест_вставки');
        input = {
            selectionStart: 2,
            selectionEnd: 2,
            value: 'тест_вставки',
        };
        expect(Input._inputPaste(input as HTMLInputElement, 'значение', 200)).toEqual(
            'тезначениест_вставки'
        );
        expect(input.value).toEqual('тест_вставки');
        input = {
            selectionStart: 0,
            selectionEnd: 0,
            value: '',
        };
        expect(Input._inputPaste(input as HTMLInputElement, 'очень_длинное_значение', 20)).toEqual(
            'очень_длинное_значен'
        );
        expect(input.value).toEqual('');
        input = {
            selectionStart: 2,
            selectionEnd: 2,
            value: 'тест_вставки',
        };
        expect(Input._inputPaste(input as HTMLInputElement, 'длинное_значение', 20)).toEqual(
            'тедлинное_ст_вставки'
        );
        expect(input.value).toEqual('тест_вставки');
    });

    it('_getStringValue', () => {
        const inputOrder = ['lastName', 'firstName', 'middleName'];
        let inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, 'test') },
                { id: 'firstName', model: new TextViewModel({}, 'test2') },
                { id: 'middleName', model: new TextViewModel({}, 'test3') },
            ],
            keyProperty: 'id',
        });
        expect(Input._getStringValue(inputOrder, inputs)).toEqual('test test2 test3');
        expect(
            Input._getStringValue(inputOrder, inputs, {
                id: 'lastName',
                value: 'pasteValue',
            })
        ).toEqual('pasteValue test2 test3');
        inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, '') },
                { id: 'firstName', model: new TextViewModel({}, 'test2') },
                { id: 'middleName', model: new TextViewModel({}, 'test3') },
            ],
            keyProperty: 'id',
        });
        expect(Input._getStringValue(inputOrder, inputs)).toEqual('test2 test3');
        expect(
            Input._getStringValue(inputOrder, inputs, {
                id: 'lastName',
                value: 'pasteValue',
            })
        ).toEqual('pasteValue test2 test3');
        expect(
            Input._getStringValue(inputOrder, inputs, {
                id: 'firstName',
                value: 'pasteValue',
            })
        ).toEqual('pasteValue test3');
        expect(
            Input._getStringValue(inputOrder, inputs, {
                id: 'middleName',
                value: 'pasteValue',
            })
        ).toEqual('test2 pasteValue');
        inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, 'test') },
                { id: 'firstName', model: new TextViewModel({}, '') },
                { id: 'middleName', model: new TextViewModel({}, 'test3') },
            ],
            keyProperty: 'id',
        });
        expect(Input._getStringValue(inputOrder, inputs)).toEqual('test test3');
        inputs = new RecordSet({
            rawData: [
                { id: 'lastName', model: new TextViewModel({}, '') },
                { id: 'firstName', model: new TextViewModel({}, '') },
                { id: 'middleName', model: new TextViewModel({}, '') },
            ],
            keyProperty: 'id',
        });
        expect(Input._getStringValue(inputOrder, inputs)).toEqual('');
    });
});
