import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Lottie/Player/Player';
import { descriptor } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { constants } from 'Env/Env';
import { Lottie } from 'Controls-Lottie/third-party/lottie.d';

interface ILottie {
    currentTime: number;
}

type ILottieState = 'playing' | 'stopped';
export type IPlayMode = 'auto' | 'click' | 'hover';
/**
 * @typedef {string} IPlayMode
 * @variant auto анимация проигрывается при загрузке контрола.
 * @variant click анимация включается и выключается по клику.
 * @variant hover анимация включается и выключается при наведении мыши.
 */

export interface IPlayerOptions extends IControlOptions {
    /**
     * @name Controls-Lottie/Player#loop
     * @cfg {boolean} Определяет, будет ли анимация зациклена
     * @default false
     * @example
     * В данном примере показано, как установить зацикливание анимации
     * WML:
     * <pre>
     *      <Controls-Lottie.Player loop="{{true}}" .../>
     * </pre>
     */
    loop?: boolean;
    /**
     * @name Controls-Lottie/Player#value
     * @cfg {object} Объект анимации
     * @example
     * В данном примере показано, как установить объект анимации
     * WML:
     * <pre>
     *      <Controls-Lottie.Player value="{{_animationValue}}" .../>
     * </pre>
     * TS:
     * <pre>
     *    import {Control, ...} from 'UI/Base';
     *    import * as myAnimationValue from 'json!MyModule/resources/animation';
     *    ...
     *    export default class MyControl extends Control<IControlOptions> {
     *      protected _animationValue: object = myAnimationValue;
     *      ...
     *    }
     * </pre>
     */
    value: object;
    /**
     * @name Controls-Lottie/Player#playMode
     * @cfg {IPlayMode} Определяет режим проигрывания анимации
     * @example
     * @default 'auto'
     * В данном примере показано, как установить воспроизведение анимации по клику
     * WML:
     * <pre>
     *      <Controls-Lottie.Player playMode="click" .../>
     * </pre>
     */
    playMode?: IPlayMode;
    /**
     * @name Controls-Lottie/Player#speed
     * @cfg {number} Устанавливает скорость проигрывания анимации
     * @default 1
     * @example
     * В данном примере показано, как ускорить воспроизведение анимации в 2 раза
     * WML:
     * <pre>
     *      <Controls-Lottie.Player speed="{{2}}" .../>
     * </pre>
     */
    speed?: number;
}

/**
 * Контрол, позволяющий воспроизводить анимацию.
 * @extends UI/Base:Control
 * @control
 * @public
 * @demo Controls-Lottie-demo/Lottie/Demo
 */
export default class Player extends Control<IPlayerOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        animContainer: HTMLDivElement;
    };
    protected _animationInstance: Lottie;
    protected _animationState: ILottieState;
    protected _lottie: typeof import('Controls-Lottie/third-party/lottie');

    protected _beforeMount(
        options?: IPlayerOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        if (constants.isBrowserPlatform) {
            return import('Controls-Lottie/third-party/lottie').then((lottie) => {
                this._lottie = lottie;
            });
        }
    }

    protected _afterMount(options: IPlayerOptions): void {
        this._initAnimation(options);
    }

    protected _beforeUpdate(options?: IPlayerOptions): void {
        if (options.loop !== this._options.loop) {
            this._animationInstance.loop = options.loop;
        }
        this._animationInstance.setSpeed(options.speed);
    }

    protected _beforeUnmount(): void {
        this._animationInstance.removeEventListener('complete', this._completeHandler);
        this._animationInstance.removeEventListener('loopComplete', this._loopComplete);
        if (!this._options.loop) {
            this._animationInstance.addEventListener('enterFrame', this._enterFrameHandler);
        }
    }

    /**
     * @method play
     * @description Метод для воспроизведения анимации
     * @returns {void}
     */
    play(): void {
        this._animationInstance.play();
        this._animationState = 'playing';
    }

    /**
     * @method stop
     * @description Метод для остановки анимации
     * @returns {void}
     */
    stop(): void {
        this._animationInstance.stop();
        this._animationState = 'stopped';
    }

    protected _initAnimation(options: IPlayerOptions): void {
        // @ts-ignore
        this._animationInstance = this._lottie.loadAnimation({
            container: this._children.animContainer,
            render: 'canvas',
            loop: options.loop,
            autoplay: options.playMode === 'auto',
            animationData: options.value,
        });

        if (options.playMode === 'auto') {
            this._animationState = 'playing';
        }

        this._animationInstance.setSpeed(options.speed);
        this._animationInstance.addEventListener('complete', this._completeHandler);
        this._animationInstance.addEventListener('loopComplete', this._loopComplete);
        if (!options.loop) {
            this._animationInstance.addEventListener('enterFrame', this._enterFrameHandler);
        }
    }

    protected _enterFrameHandler = (animation: ILottie) => {
        if (animation.currentTime >= this._animationInstance.totalFrames - 1) {
            this._animationInstance.pause();
        }
    };

    protected _completeHandler = () => {
        this._animationState = 'stopped';
        this._notify('complete');
    };

    protected _loopComplete = () => {
        this._notify('complete');
    };

    protected _mouseEnterHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this._options.playMode === 'hover') {
            this.play();
        }
    }

    protected _mouseLeaveHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this._options.playMode === 'hover') {
            this.stop();
        }
    }

    protected _clickHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this._options.playMode === 'click') {
            if (this._animationState === 'stopped') {
                this.play();
            } else {
                this.stop();
            }
        }
    }

    static getDefaultOptions(): Partial<IPlayerOptions> {
        return {
            loop: false,
            playMode: 'auto',
            speed: 1,
        };
    }

    static getOptionTypes(): Record<string, unknown> {
        return {
            loop: descriptor(Boolean),
            value: descriptor(Object).required(),
            playMode: descriptor(String).oneOf(['auto', 'click', 'hover']),
            speed: descriptor(Number),
        };
    }
}
