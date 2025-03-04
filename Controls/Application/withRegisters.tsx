import { Component, ComponentType } from 'react';
import { EventSubscriber, withWasabyEventObject } from 'UI/Events';
import { IApplicationProps, IApplicationRegistrars } from './Interfaces';
import { RegisterClass } from 'Controls/event';
import { IDragObject } from 'Controls/dragnDrop';
import { detection } from 'Env/Env';
import { mergeHandlers } from './Utils';

function isIOS13() {
    const oldIosVersion: number = 12;
    return detection.isMobileIOS && detection.IOSVersion > oldIosVersion;
}
const REGISTERS_LIST = [
    'customscroll',
    'controlResize',
    'mousemove',
    'mouseup',
    'touchmove',
    'touchend',
    'mousedown',
];

export default function withRegisters<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T> {
        private _registers: IApplicationRegistrars & Record<string, RegisterClass>;

        constructor(props: T) {
            super(props);

            this._createRegisters();
        }

        componentDidMount(): void {
            // Подписка через viewPort дает полную информацию про ресайз страницы, на мобильных устройствах
            // сообщает так же про изменение экрана после показа клавиатуры и/или зуме страницы.
            // Подписка на body стреляет не всегда. в 2100 включаю только для 13ios, в перспективе можно включить
            // везде, где есть visualViewport

            if (isIOS13()) {
                window.visualViewport.addEventListener('resize', this._resizePage.bind(this));
            }
            window.addEventListener('resize', this._resizePage.bind(this));
        }
        componentWillUnmount(): void {
            for (const register in this._registers) {
                if (this._registers.hasOwnProperty(register)) {
                    this._registers[register].destroy();
                }
            }
        }

        private _createRegisters(): void {
            this._registers = {};
            REGISTERS_LIST.forEach((register) => {
                this._registers[register] = new RegisterClass({ register });
            });
        }
        protected _registerHandler(
            event: Event,
            registerType: string,
            component: any,
            callback: (...args: unknown[]) => void,
            config: object
        ): void | IDragObject {
            if (this._registers[registerType]) {
                this._registers[registerType].register(
                    event,
                    registerType,
                    component,
                    callback,
                    config
                );
                return;
            }
        }
        protected _unregisterHandler(
            event: Event,
            registerType: string,
            component: any,
            config: object
        ): void {
            if (this._registers[registerType]) {
                this._registers[registerType].unregister(event, registerType, component, config);
                return;
            }
        }

        protected _scrollPage(e: Event): void {
            this._registers.customscroll?.start(e);
        }
        protected _resizePage(e: Event): void {
            this._registers.controlResize?.start(e);
        }
        protected _mousedownPage(e: Event): void {
            this._registers.mousedown?.start(e);
        }
        protected _mousemovePage(e: Event): void {
            this._registers.mousemove?.start(e);
        }
        protected _mouseupPage(e: Event): void {
            this._registers.mouseup?.start(e);
        }
        protected _touchmovePage(e: Event): void {
            this._registers.touchmove?.start(e);
        }
        protected _touchendPage(e: Event): void {
            this._registers.touchend?.start(e);
        }
        protected _mouseleavePage(e: Event): void {
            /**
             * Перемещение элементов на странице происходит по событию mousemove. Браузер генерирует его исходя из
             * доступных ресурсов, и с дополнительными оптимизациями, чтобы не перегружать систему. Поэтому событие не происходит
             * на каждое попиксельное смещение мыши. Между двумя соседними событиями, мышь проходит некоторое расстояние.
             * Чем быстрее перемещается мышь, тем больше оно будет.
             * Событие не происход, когда мышь покидает граници экрана. Из-за этого, элементы не могут быть перемещены в плотную к ней.
             * В качестве решения, генерируем событие mousemove, на момент ухода мыши за граници экрана.
             * Демо: https://jsfiddle.net/q7rez3v5/
             */
            this._registers.mousemove?.start(e);
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    onScroll={mergeHandlers(this._scrollPage.bind(this), this.props.onScroll)}
                    onMouseDown={mergeHandlers(
                        this._mousedownPage.bind(this),
                        this.props.onMouseDown
                    )}
                    onMouseMove={mergeHandlers(
                        this._mousemovePage.bind(this),
                        this.props.onMouseMove
                    )}
                    onMouseUp={mergeHandlers(this._mouseupPage.bind(this), this.props.onMouseUp)}
                    onTouchMove={mergeHandlers(
                        this._touchmovePage.bind(this),
                        this.props.onTouchMove
                    )}
                    onTouchEnd={mergeHandlers(this._touchendPage.bind(this), this.props.onTouchEnd)}
                    onMouseLeave={mergeHandlers(
                        this._mouseleavePage.bind(this),
                        this.props.onMouseLeave
                    )}
                    /*кастомные обработчики*/
                    register={mergeHandlers(
                        this._registerHandler.bind(this),
                        this.props.register,
                        true
                    )}
                    unregister={mergeHandlers(
                        this._unregisterHandler.bind(this),
                        this.props.unregister,
                        true
                    )}
                    resize={mergeHandlers(this._resizePage.bind(this), this.props.resize, true)}
                />
            );
        }
        static displayName = 'withRegisters';
    };
}
