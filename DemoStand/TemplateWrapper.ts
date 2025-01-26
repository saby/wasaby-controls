import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import template = require('wml!DemoStand/TemplateWrapper');
import getTemplateName from 'DemoStand/getTempaletName';

interface IDemoTemplateWrapper extends IControlOptions {
    traverse: string;
}

export default class RootRouterDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected templateLoaded: boolean;

    protected templateName: string;

    constructor(opt) {
        super(opt);

        this.templateName = getTemplateName(opt.traverse);
    }

    protected _beforeMount(
        opts: IDemoTemplateWrapper,
        context: object,
        receivedState: void
    ): void | Promise<void> {
        if (receivedState !== undefined) {
            this.templateLoaded = true;

            return;
        }

        if (isLoaded(this.templateName)) {
            this.templateLoaded = true;

            return;
        }

        return loadAsync(this.templateName)
            .then(() => {
                this.templateLoaded = true;
            })
            .catch(() => {
                this.templateLoaded = false;
            });
    }
}
