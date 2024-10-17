import * as template from 'wml!Controls-Wizard/_vertical/Container/Container';
import { Control, TemplateFunction } from 'UI/Base';
import { IStepOptions } from '../IStep';
import { SyntheticEvent } from 'UICommon/Events';
import { IScrollState } from 'Controls/scroll';
import 'css!Controls-Wizard/vertical';

/**
 * Контрол для расположения вертикального мастера в скролл контейнере
 *
 * <a href="/doc/platform/developmentapl/interface-development/controls/navigation/master/#wizardverticalcontainer">Руководство разработчика</a>
 * @extends UI/Base:Control
 * @demo Controls-Wizard-demo/demoVertical2/VerticalWithStack
 * @public
 */
export default class Container extends Control<IStepOptions> {
    protected _template: TemplateFunction = template;

    /**
     * Вызывает метод вложенного скролл контейнера
     * @param {String} methodName Название метода.
     * @param {unknown[]} args Массив аргументов.
     * @example
     *  <pre>
     *      private _scrollContentInWizard() {
     *          this._children.wizard.callScrollMethod('scrollToBottom');
     *      }
     * </pre>
     */
    callScrollMethod(methodName: string, args: string[]): unknown {
        return this._children.wizardScrollContainer[methodName](...args);
    }

    /**
     * Прокидывает выше событие scrollStateChanged (чтобы его можно было поймать на Controls-Wizard.vertical:Container)
     * @param event
     * @param newState
     * @param oldState
     * @protected
     */
    protected _scrollStateChangedHandler(
        event: SyntheticEvent<Event>,
        newState: IScrollState,
        oldState: IScrollState
    ): void {
        this._notify('scrollStateChanged', [newState, oldState]);
    }

    static defaultProps: object = {
        topShadowVisibility: 'auto',
        bottomShadowVisibility: 'auto',
    };
}

/**
 * @name Controls-Wizard/vertical:Container#topShadowVisibility
 * @cfg {string} Режим {@link Controls/scroll:Container#topShadowVisibility отображения тени} cверху.
 * @default 'auto'
 */

/**
 * @name Controls-Wizard/vertical:Container#bottomShadowVisibility
 * @cfg {string} Режим {@link Controls/scroll:Container#bottomShadowVisibility отображения тени} снизу.
 * @default 'auto'
 */
