import { Bus } from 'Env/Event';
import CalculatorUtils from './Utils';

let calculatorOpener;
let setActiveInput: (input: HTMLInputElement) => void;

/*
   Т.к. IE и старый EDGE не поддерживают KeyboardEvent.code нужно использовать key,
   который возвращает значение с учетом регистра и локали
 */
const C_BUTTON_KEYS = [
    // en locale
    'c',
    'C',

    // ru locale
    'с',
    'С',
];
const F9_BUTTON_KEY = 'F9';

class InitHotKeys {
    init(): void {
        // TODO: https://online.sbis.ru/opendoc.html?guid=157084a2-d702-40b9-b54e-1a42853c301e
        if (window) {
            window.addEventListener('keydown', this._keydownHandler.bind(this), true);
            window.addEventListener('mousedown', this._mousedownHandler.bind(this), true);
        }
    }
    _keydownHandler(event: KeyboardEvent): void {
        const nativeEvent: KeyboardEvent = event as KeyboardEvent;
        if (
            (nativeEvent.altKey &&
                nativeEvent.ctrlKey &&
                C_BUTTON_KEYS.includes(nativeEvent.key)) ||
            nativeEvent.key === F9_BUTTON_KEY
        ) {
            this._openCalculator();
        }
    }
    _mousedownHandler(event: MouseEvent): void {
        // Калькулятор могут открыть из кода, из-за чего calculatorOpener не определен.
        // Поэтому на всякий случай смотрим нет ли на странице открытого окна с калькулятором.
        if (
            (calculatorOpener && calculatorOpener.isOpened()) ||
            document.querySelector('.Calculator-Dialog')
        ) {
            let target: HTMLElement = event.target as HTMLElement;
            const selector =
                '.controls-DecoratorMoney, .controls-DecoratorNumber, .ws-moneyDecorator';
            const decoratorNode = target.closest(selector) as HTMLElement;
            if (decoratorNode) {
                target = decoratorNode;
            }
            if (!target.closest('.Calculator-Popup__Container')) {
                const value = (target as HTMLInputElement).value || target.textContent;
                const parsedValue = CalculatorUtils.prepareStringToNumber(value);
                if (parsedValue !== null) {
                    if (this._isInput(target)) {
                        setActiveInput(target as HTMLInputElement);
                    } else {
                        // Фича: Есть редактирование по месту в списке. Клик по декоратору внутри редактирования
                        // передает значение в калькулятор. После клика и передачи данных редактирование по месту
                        // переходит в режим редакции и декоратор заменяется на поле ввода.
                        // Для того, чтобы калькулятор по ctrl+enter мог вернуть значение в поле ввода, которого
                        // на момент клика еще не было, ждем {delay}мс, чтобы циклы синхронизации точно прошли
                        // и фокус установился в нужную ноду.
                        const delay: number = 1000;
                        setTimeout(() => {
                            const activeElement = document.activeElement as HTMLElement;
                            if (this._isInput(activeElement)) {
                                setActiveInput(activeElement as HTMLInputElement);
                            }
                        }, delay);
                    }
                    Bus.channel('CalculatorEvents').notify('numberClick', parsedValue);
                }
            }
        }
    }
    private _openCalculator(): void {
        if (calculatorOpener) {
            calculatorOpener.open();
        } else {
            import('Controls-Calculator/Button').then((ButtonLib) => {
                setActiveInput = ButtonLib.setActiveInput;
                calculatorOpener = new ButtonLib.Opener();
                calculatorOpener.open();
            });
        }
    }

    private _isInput(node: HTMLElement): boolean {
        return node?.nodeName === 'INPUT';
    }
}

export default new InitHotKeys();
