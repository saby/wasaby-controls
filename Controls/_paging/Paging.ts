/**
 * @kaizen_zone 2b102d0c-fd4d-4044-be66-780184ba4e71
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import pagingTemplate = require('wml!Controls/_paging/Paging/Paging');
import { SyntheticEvent } from 'Vdom/Vdom';
import { TNavigationPagingMode, TDigitRenderCallback } from 'Controls/interface';
import { IArrowState, TArrowStateVisibility } from 'Controls/_paging/interface/IArrowState';
import 'css!Controls/paging';

type TButtonState = 'normal' | 'disabled';

export interface IPagingOptions extends IControlOptions {
    pagesCount?: number;
    selectedPage?: number;
    contrastBackground?: boolean;
    contentTemplate?: TemplateFunction;
    elementsCount?: number;
    arrowState: IArrowState;
    pagingMode?: TNavigationPagingMode;
    digitRenderCallback?: TDigitRenderCallback;
    showDigits?: boolean;
    showTotalCounter?: boolean;
}

/**
 * Контрол для отображения кнопок постраничной навигации.
 *
 * @remark
 * Данный контрол также входит в состав списка. Подробнее читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/data-pagination/ статье}.
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_paging.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @public
 *
 * @mixes Controls/_paging/Paging/Styles
 * @mixes Controls/_paging/Paging/DigitButtons/Styles
 *
 * @ignoreoptions readOnly
 * @demo Controls-demo/Paging/WI/Index
 *
 */
class Paging extends Control<IPagingOptions> {
    protected _template: TemplateFunction = pagingTemplate;
    protected _stateBackward: TButtonState = 'normal';
    protected _stateForward: TButtonState = 'normal';
    protected _stateReset: TButtonState = 'disabled';
    protected _stateTop: TButtonState = 'normal';
    protected _stateBottom: TButtonState = 'normal';

    private _initArrowDefaultStates(config: IPagingOptions): void {
        if (config.arrowState) {
            if (config.pagingMode === 'numbers') {
                if (config.selectedPage <= 1) {
                    this._stateTop = this._getState('hidden');
                } else {
                    this._stateTop = this._getState('visible');
                }

                if (config.selectedPage >= config.pagesCount) {
                    this._stateBottom = this._getState('hidden');
                } else {
                    this._stateBottom = this._getState('visible');
                }
            } else {
                this._stateTop = this._getState(config.arrowState.begin || 'readonly');
                this._stateBackward = this._getState(config.arrowState.prev || 'readonly');
                this._stateForward = this._getState(config.arrowState.next || 'readonly');
                this._stateBottom = this._getState(config.arrowState.end || 'readonly');
                this._stateReset =
                    config.arrowState.reset === 'day' || config.arrowState.reset === 'home'
                        ? 'normal'
                        : 'disabled';
            }
        }
    }

    private _isDigit(): boolean {
        return this._options.showDigits || this._options.pagingMode === 'numbers';
    }

    private _getState(state: TArrowStateVisibility): TButtonState {
        return state === 'visible' ? 'normal' : 'disabled';
    }

    private _getResetButtonDay(): number {
        return this._options._date || new Date().getDate();
    }
    private _needLeftPadding(pagingMode, contentTemplate) {
        return !(
            contentTemplate &&
            (pagingMode === 'edge' || pagingMode === 'edges' || pagingMode === 'end')
        );
    }

    // Если есть произвольный шаблон или пришло колличество всех элементов для счетчика, то убираем отступ у первой стрелочки.
    private _needLeftPaddingFirstArrow(pagingMode, contentTemplate): boolean {
        const { showTotalCounter } = this._options;
        return !showTotalCounter && this._needLeftPadding(pagingMode, contentTemplate);
    }

    private _getArrowStateVisibility(state: string): string {
        if (this._options.arrowState) {
            return this._options.arrowState[state] || 'visible';
        }
        if (this._isDigit()) {
            return 'visible';
        }
        return 'hidden';
    }

    private _initArrowStateBySelectedPage(config: IPagingOptions): void {
        const page = config.selectedPage;
        if (page <= 1) {
            this._stateBackward = this._stateTop = this._getState('hidden');
        } else {
            this._stateBackward = this._stateTop = this._getState('visible');
        }

        if (page >= config.pagesCount) {
            this._stateForward = this._stateBottom = this._getState('hidden');
        } else {
            this._stateForward = this._stateBottom = this._getState('visible');
        }
    }

    private _initArrowState(newOptions: IPagingOptions): void {
        const showDigits = newOptions.showDigits;
        if (showDigits) {
            this._initArrowStateBySelectedPage(newOptions);
        } else {
            this._initArrowDefaultStates(newOptions);
        }
    }

    private _isShowContentTemplate(): boolean {
        return !(
            this._getArrowStateVisibility('begin') === 'hidden' &&
            this._getArrowStateVisibility('prev') === 'hidden' &&
            this._getArrowStateVisibility('next') === 'hidden' &&
            this._getArrowStateVisibility('end') === 'hidden'
        );
    }

    private _changePage(page: number): void {
        if (this._options.selectedPage !== page) {
            this._notify('selectedPageChanged', [page]);
        }
    }

    protected _beforeMount(newOptions: IPagingOptions): void {
        this._initArrowState(newOptions);
    }

    protected _beforeUpdate(newOptions: IPagingOptions): void {
        this._initArrowState(newOptions);
    }

    protected _digitClick(e: SyntheticEvent<Event>, digit: number): void {
        this._changePage(digit);
    }

    protected _arrowClick(e: SyntheticEvent<Event>, btnName: string, direction: string): void {
        let targetPage: number;
        if (this['_state' + direction] !== 'normal') {
            return;
        }
        if (this._options.showDigits) {
            switch (btnName) {
                case 'Begin':
                    targetPage = 1;
                    break;
                case 'End':
                    targetPage = this._options.pagesCount;
                    break;
                case 'Prev':
                    targetPage = this._options.selectedPage - 1;
                    break;
                case 'Next':
                    targetPage = this._options.selectedPage + 1;
                    break;
            }
            this._changePage(targetPage);
        }
        this._notify('onArrowClick', [btnName]);
    }

    static defaultProps: {
        selectedPage: 1;
        contrastBackground: false;
        pagingMode: 'basic';
        showDigits: false;
    };
}

export default Paging;

/**
 * @name Controls/_paging/Paging#pagesCount
 * @cfg {Number} Размер страницы
 */

/**
 * @name Controls/_paging/Paging#showDigits
 * @cfg {Boolean} Отображать кнопки с номерами страницы.
 */
/**
 * @name Controls/_paging/Paging#selectedPage
 * @cfg {Number} Номер выбранной страницы.
 */

/**
 * @name Controls/_paging/Paging#showTotalCounter
 * @cfg {Boolean} Опция управляет возможностью показа количества элементов, если elementsCount больше 0 и pagingMode не равен "number".
 */

/**
 * @name Controls/_paging/Paging#onArrowClick
 * @event Происходит при клике по кнопкам перехода к первой, последней, следующей или предыдущей странице.
 * @remark
 * Событие происходит, когда опция showDigits установлена в значение true.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {ButtonName} btnName Имя нажатой кнопки.
 */

/**
 * @typedef {String} ButtonName
 * @variant Begin Кнопка "В начало".
 * @variant End Кнопка "В конец".
 * @variant Prev Кнопка "Назад".
 * @variant Next Кнопка "Вперёд".
 */

/**
 * @name Controls/_paging/Paging#arrowState
 * @cfg {Controls/_paging/interface/IArrowState} Опция управляет возможностью показа/скрытия кнопок в пэйджинге.
 */

/**
 * @name Controls/_paging/Paging#pagingMode
 * @cfg {Controls/_interface/INavigation/TNavigationPagingMode.typedef} Внешний вид пэйджинга. Позволяет для каждого конкретного реестра задать внешний вид в зависимости от требований к интерфейсу.
 */

/**
 * @name Controls/_paging/Paging#contrastBackground
 * @cfg {Boolean} Определяет контрастность фона кнопки по отношению к ее окружению.
 */

/**
 * @name Controls/_paging/Paging#contentTemplate
 * @cfg {Function} Опция управляет отображением произвольного шаблона внутри пэйджинга.
 */

/**
 * @name Controls/_paging/Paging#elementsCount
 * @cfg {Number} Опция управляет возможностью показа количества элементов, если их количество больше 0.
 */

/**
 * @name Controls/_paging/Paging#digitRenderCallback
 * @cfg {Controls/_interface/INavigation/TDigitRenderCallback.typedef} Опция, позволяющая задавать отображение эмодзи вместо номеров страниц. Колбэк - функция, устанавливает соотвествие между номером страницы и эмодзи
 * @demo Controls-demo/list_new/Navigation/Paging/WI/DigitsView/Index
 */
