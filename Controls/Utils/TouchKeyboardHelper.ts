/**
 * Утилита рассчета высоты клавиатуры на тач устройствах
 */

import { detection, constants } from 'Env/Env';
import { Bus as EventBus } from 'Env/Event';
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import { DimensionsMeasurer } from 'Controls/sizeUtils';

const ipadCoefficient = {
    portrait: 0.3,
    landscape: 0.53,
};

const TouchKeyboardHelper = {
    _keyboardVisible: false,
    _keyboardAnimation: false,

    _keyboardShowHandler(): void {
        this._keyboardVisible = true;
        this._keyboardHandler();
    },

    _keyboardHideHandler(): void {
        this._keyboardVisible = false;
        this._keyboardHandler();
    },

    _keyboardHandler(): void {
        // из-за анимации клавиатуры на мобильных устройствах происходит сдвиг контента
        // что приводит к скрытие меню. делаем задержку и на время анимации меню не закрываем
        // увеличили время с 300мс до 350мс, т.к. на ipad мини клавиутаура анимируется дольше чем 300мс
        const IPAD_ANIMATION_TIMEOUT = 350;
        if (!this._keyboardAnimation) {
            this._keyboardAnimation = setTimeout(() => {
                this._keyboardAnimation = null;
            }, IPAD_ANIMATION_TIMEOUT);
        }
    },

    isPortrait(): boolean {
        // Высота экрана может уменьшиться на высоту клавиатуры. Для точного определения ориентации учитываю скроллY.
        return window.innerHeight + window.scrollY > window.innerWidth;
    },

    getKeyboardAnimation(): boolean {
        return this._keyboardAnimation;
    },

    getKeyboardHeight(notConsiderFocusPosition: boolean): number {
        if (this.isKeyboardVisible(notConsiderFocusPosition)) {
            if (detection.isMobileIOS) {
                const twiceCoef = 2;
                const windowDimensions = DimensionsMeasurer.getWindowDimensions();
                // на новых версиях ios(12.1.3/12.1.4), в горизонтальной ориентации иногда(!!!) клавиатура при своем показе
                // уменьшает высоту экрана(как это и должно быть). в этом случае хэлпер должен вернуть высоту 0, чтобы
                // окна не вычитали высоту клавиатуры из высоты страницы. P.S. Если открыть клаву в вертикальной ориентации
                // и не закрывая ее поменять ориантацию, этот хак не поможет, код будет работать по старой логике.м
                if (
                    !this.isPortrait() &&
                    window.screen.availHeight / window.innerHeight > twiceCoef
                ) {
                    return 0;
                }
                return (
                    windowDimensions.innerHeight *
                    (this.isPortrait() ? ipadCoefficient.portrait : ipadCoefficient.landscape)
                );
            }
        }
        return 0;
    },

    /*
      В методе написан комментарий, предлагающий альтернативный способ определения видимости клавиатуры на ios.
      Этот способо не подходит для Wasaby, т.к. фаза построения контрола - асинхронная, фокус, проставленный
      в поле ввода асинхронно не приводит к показу клавиатуры. Для вычисления клавиатуры на Wasaby передаю опцию
      notConsiderFocusPosition, которая отключает определение видимости клавиатуры по фокусу в полях ввода.
   */
    isKeyboardVisible(notConsiderFocusPosition: boolean): boolean {
        let isVisible: boolean = this._keyboardVisible;

        // Отдельно проверяем, есть ли фокус в полях ввода, т.к. клавиатура показана только в этом случае.
        // Можно обкатать механизм на этих правках и впоследствии избавиться от нотифая глобального события в полях ввода.
        // Для определения того, что клавиатура показалась и нужно на это отреагировать, в application можно проверять,
        // Куда пришел фокус, если это input/textarea/contenteditable, то через emitter/listener сообщать
        // об этом дочерним компонентам. Костыль актуален только для старых контролов, на вдом отключил.
        if (
            !isNewEnvironment() &&
            !notConsiderFocusPosition &&
            !isVisible &&
            constants.isBrowserPlatform &&
            document.activeElement
        ) {
            const isInput = document.activeElement.tagName === 'INPUT';
            const isTextArea = document.activeElement.tagName === 'TEXTAREA';
            const isContentEditable =
                document.activeElement.getAttribute('contenteditable') === 'true';

            if (isInput || isTextArea || isContentEditable) {
                isVisible = true;
            }
        }
        return isVisible;
    },
};

if (constants.compatibility.touch) {
    const keyboardShowHandler = TouchKeyboardHelper._keyboardShowHandler.bind(TouchKeyboardHelper);
    const keyboardHideHandler = TouchKeyboardHelper._keyboardHideHandler.bind(TouchKeyboardHelper);
    EventBus.globalChannel().subscribe('MobileInputFocus', keyboardShowHandler);
    EventBus.globalChannel().subscribe('MobileInputFocusOut', keyboardHideHandler);
}

export default TouchKeyboardHelper;
