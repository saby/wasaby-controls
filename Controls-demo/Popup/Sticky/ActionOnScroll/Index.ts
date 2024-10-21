import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Sticky/ActionOnScroll/Template';
import { StickyOpener } from 'Controls/popup';
import { Container } from 'Controls/scroll';
import 'wml!Controls-demo/Popup/Opener/DialogTpl';

class PopupStack extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        stickyButton: Control<IControlOptions>;
        stickyButton2: Control<IControlOptions>;
        scroll: Container;
    };
    private _opener: StickyOpener = new StickyOpener({
        template: 'Controls-demo/Popup/Sticky/StickyTemplate',
        direction: {
            vertical: 'bottom',
            horizontal: 'right',
        },
        targetPoint: {
            vertical: 'top',
            horizontal: 'left',
        },
    });

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        const topOffset = 490;
        const leftOffset = 2000;
        this._children.scroll.scrollTo(topOffset);
        this._children.scroll.horizontalScrollTo(leftOffset);
    }

    protected openStickyScroll(): void {
        this._opener.open({
            target: this._children.stickyButton,
            opener: this._children.stickyButton,
            actionOnScroll: 'close',
        });
    }
    protected openSticky(): void {
        this._opener.open({
            target: this._children.stickyButton2,
            opener: this._children.stickyButton2,
            actionOnScroll: 'track',
        });
    }

    protected openStickyHide(): void {
        this._opener.open({
            target: this._children.stickyButton3,
            opener: this._children.stickyButton3,
            actionOnScroll: 'hide',
        });
    }

    static _styles: string[] = [
        'Controls-demo/Popup/PopupPage',
        'Controls-demo/Popup/Opener/resources/StackHeader',
    ];
}
export default PopupStack;
