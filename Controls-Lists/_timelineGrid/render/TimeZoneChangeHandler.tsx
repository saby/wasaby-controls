/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import { cookie } from 'Application/Env';
import { Confirmation } from 'Controls/popup';
import * as rk from 'i18n!Controls-Lists';

interface ITimeZoneChangeHandler {
    slice: TimelineGridSlice;
}
const MILLISECONDS = 1000;

/**
 * Компонент, отслеживающий изменения часового пояса.
 */
export function TimeZoneChangeHandler(props: ITimeZoneChangeHandler): React.ReactElement {
    const containerRef = React.useRef(null);
    const timeZoneCheckerRef = React.useRef(0);
    const popupOpenedRef = React.useRef(false);
    const timeZoneOffset = React.useRef(new Date().getTimezoneOffset());
    const checkTimeZone = React.useCallback(() => {
        const currentTimezone = new Date().getTimezoneOffset();
        if (timeZoneOffset.current !== currentTimezone) {
            cookie.set('tz', `${currentTimezone}`, {
                path: '/',
                expires: 30,
            });
            if (!popupOpenedRef.current) {
                popupOpenedRef.current = true;
                Confirmation.openPopup(
                    {
                        message: rk(
                            'Ваш часовой пояс был изменен, необходима перезагрузка для последующей корректной работы'
                        ),
                        details: rk(
                            'Нажмите "Перезагрузить" для обновления или "ОК" для продолжения работы'
                        ),
                        yesCaption: rk('ОК'),
                        noCaption: rk('Перезагрузить'),
                    },
                    containerRef.current
                ).then((result: boolean) => {
                    popupOpenedRef.current = false;
                    if (!result) {
                        window.location.reload();
                    }
                });
            }
            const correctedRange = {
                start: new Date(props.slice.range.start),
                end: new Date(props.slice.range.end),
                needScroll: props.slice.range.needScroll,
            };
            const tzOffset = timeZoneOffset.current - currentTimezone;
            correctedRange.start.setMinutes(correctedRange.start.getMinutes() - tzOffset);
            correctedRange.end.setMinutes(correctedRange.end.getMinutes() - tzOffset);
            props.slice.setRange(correctedRange);

            timeZoneOffset.current = currentTimezone;
        }
    }, [props.slice]);

    React.useEffect(() => {
        timeZoneCheckerRef.current = setInterval(checkTimeZone, MILLISECONDS);
        return () => {
            clearInterval(timeZoneCheckerRef.current);
        };
    }, [props.slice]);
    return <div className="ws-hidden" ref={containerRef} />;
}
