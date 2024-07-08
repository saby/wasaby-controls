import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!DemoStand/ContainerTheme');

/**
 * This control trying to get theme option from url and pass it to demo
 */
export default class ContainerTheme extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _zoomValue: number = 1;

    /**
     * Приводит тему к средней с добавлением zoom = 1.33 при роуте theme/retail__dark-large
     * Сделано для отображения демок в крупной теме Розницы
     * @param {String} theme
     * @return {String}
     */
    _convertTheme(theme: string): string {
        const className = `controls_theme-${theme}`;
        if (theme.includes('large')) {
            const themeSize = className?.split('-')[1];
            const newTheme = className.replace(themeSize, 'medium');

            this._zoomValue = 1.33;

            return newTheme;
        }

        return theme;
    }
}
