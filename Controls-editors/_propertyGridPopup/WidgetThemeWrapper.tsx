import { PropsWithChildren, useContext } from 'react';
import { WidgetThemeClassesContext } from './WidgetPropertyGridPopup';

interface IWidgetThemeWrapper {
    /**
     * Тип цветовой темы, если не указано будет применена текущая схема сайта
     */
    scheme?: 'light' | 'dark';
}

const DARK = 't-dark';
const LIGHT = 't-light';

/**
 * Компонент применяет цветовую и шрифтовую тему сайта к своему содержимому.
 * @public
 */
export function WidgetThemeWrapper(props: PropsWithChildren<IWidgetThemeWrapper>) {
    let themeClasses = useContext(WidgetThemeClassesContext);
    if (props.scheme) {
        const allClasses = themeClasses
            .split(' ')
            .filter((name) => name && ![DARK, LIGHT].includes(name));
        switch (props.scheme) {
            case 'light':
                allClasses.push(LIGHT);
                break;
            case 'dark':
                allClasses.push(DARK);
                break;
        }
        themeClasses = allClasses.join(' ');
    }
    return <div className={`tw-contents ${themeClasses}`}>{props.children}</div>;
}
