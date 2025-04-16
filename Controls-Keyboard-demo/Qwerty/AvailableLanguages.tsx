import 'css!Controls/CommonClasses';
import { useState, useEffect, forwardRef, LegacyRef } from 'react';
import { default as Qwerty, Langs } from 'Controls-Keyboard/Qwerty';

export default forwardRef(function (props, ref: LegacyRef<HTMLDivElement>) {
    const [pressedButton, setPressedButton] = useState<string | null>(null);

    const itemPressHandler = (key: string) => {
        setPressedButton(key);
    };

    useEffect(() => {
        Qwerty.open({
            opener: null,
            templateOptions: {
                itemPressCallback: itemPressHandler,
                size: 'l',
                accentButtonCaption: 'Найти',
                availableLanguages: [Langs.Ru, Langs.En, Langs.Kk],
                lang: Langs.Ru,
            },
        });
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <div className="controls-text-label">
                Нажата клавиша: {!!pressedButton ? pressedButton : 'None'}
            </div>
        </div>
    );
});
