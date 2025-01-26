import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/ResizingLine/ResizingLine');
import { SyntheticEvent } from 'Vdom/Vdom';

class ResizingLine extends Control<IControlOptions> {
    private _widthOfRightContainer: number = 100;
    private _widthOfCenterContainer: number = 100;
    private _widthOfLeftContainer: number = 100;


    private _minOffsetRight: number;
    private _maxOffsetRight: number;

    private _minOffsetCenter: number;
    private _maxOffsetCenter: number;

    private _minOffsetLeft: number;
    private _maxOffsetLeft: number;

    private static MIN_WIDTH: number = 100;
    private static MAX_WIDTH: number = 300;
    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._updateOffsetLeft();
        this._updateOffsetCenter();
        this._updateOffsetRight();
    };


    protected _template: TemplateFunction = controlTemplate;

    protected _offsetHandler(
        event: SyntheticEvent<Event>,
        containerName: string,
        offset: number
    ): void {
        let value: number;
        switch (containerName) {
            case 'leftContainer':
                value = this._widthOfLeftContainer + offset;
                this._widthOfLeftContainer = ResizingLine._limit(value);
                this._updateOffsetLeft();
                break;
            case 'centerContainer':
                value = this._widthOfCenterContainer + offset;
                this._widthOfCenterContainer = ResizingLine._limit(value);
                this._updateOffsetCenter();
                break;
            case 'rightContainer':
                value = this._widthOfRightContainer + offset;
                this._widthOfRightContainer = ResizingLine._limit(value);
                this._updateOffsetRight();
                break;
        }
    }



    static _styles: string[] = ['Controls-demo/ResizingLine/ResizingLine'];

    private _updateOffsetRight(): void {
        this._maxOffsetRight = Math.max(300 - this._widthOfRightContainer, 0);
        this._minOffsetRight = Math.max(this._widthOfRightContainer - 100, 0);
    }

    private _updateOffsetCenter(): void {
        this._maxOffsetCenter = Math.max(300 - this._widthOfCenterContainer, 0);
        this._minOffsetCenter = Math.max(this._widthOfCenterContainer - 100, 0);
    }

    private _updateOffsetLeft(): void {
        this._maxOffsetLeft = Math.max(300 - this._widthOfLeftContainer, 0);
        this._minOffsetLeft = Math.max(this._widthOfLeftContainer - 100, 0);
    }

    private static _limit(value: number): number {
        return Math.max(ResizingLine.MIN_WIDTH, Math.min(value, ResizingLine.MAX_WIDTH));
    }
}

export default ResizingLine;
