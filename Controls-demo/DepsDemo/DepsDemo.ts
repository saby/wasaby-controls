import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'tmpl!Controls-demo/DepsDemo/DepsDemo';

export default class DepsDemo extends Control {
    protected _template: TemplateFunction = template;
    protected isOK: boolean = true;

    protected _afterMount(): void {
        const scripts: HTMLCollectionOf<HTMLScriptElement> =
            document.getElementsByTagName('script');
        if (this.checkDebug(scripts)) {
            this.isOK = true;
        } else {
            const depArray = ['Controls/input:Text', 'Controls.buttons:Button'];
            let depName;
            let allDepsDefined = true;
            for (let j = 0; j < depArray.length; j++) {
                depName = depArray[j];
                if (!require.defined(depName)) {
                    allDepsDefined = false;
                }
            }
            this.isOK = allDepsDefined;
        }
    }
    private checkDebug(scripts: HTMLCollectionOf<HTMLScriptElement>): boolean {
        for (let i = 0; i < scripts.length; i++) {
            // @ts-ignore
            if (/scripts_[0-9]+/g.test(scripts[i].attributes.key)) {
                return false;
            }
        }
        return true;
    }
}
