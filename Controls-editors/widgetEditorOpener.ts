import { IObjectEditorOpenerProps, default as ObjectEditorOpener } from './objectEditorOpener';

export interface IWidgetEditorOpenerProps extends IObjectEditorOpenerProps {
    /**
     * Классы, которыми применяется тема к редактируемому фрейму
     */
    themeClasses: string;
}

/**
 * Опенер редактора типа "Виджет"
 * @public
 **/
export class WidgetEditorOpener extends ObjectEditorOpener {
    private _options: IWidgetEditorOpenerProps;
    open(options: IWidgetEditorOpenerProps): Promise<void> {
        this._options = options;
        return super.open(options);
    }

    protected override getTemplateProps() {
        return {
            themeClasses: this._options.themeClasses,
        };
    }

    protected override getDefaultTemplate(): Promise<string> {
        return Promise.resolve('Controls-editors/propertyGridPopup:WidgetPropertyGridPopup');
    }
}
