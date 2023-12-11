import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Lottie-demo/Lottie/Demo';
import * as testAnim from 'json!Controls-Lottie-demo/Lottie/testAnim';
import Player, { IPlayMode } from 'Controls-Lottie/Player';
import { Memory } from 'Types/source';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _animationValue: Object = testAnim;
    protected _isLoopActivate: boolean = false;
    protected _playMode: IPlayMode = 'auto';
    protected _currentSpeed: number = 1;
    protected _source: Memory = new Memory({
        data: [{ id: 'auto' }, { id: 'click' }, { id: 'hover' }],
    });

    protected _children: {
        myAnimation: Player;
    };

    protected _startClickHandler(): void {
        this._children.myAnimation.play();
    }

    protected _stopClickHandler(): void {
        this._children.myAnimation.stop();
    }

    static _styles: string[] = ['Controls-Lottie-demo/Lottie/Demo/Demo'];
}
