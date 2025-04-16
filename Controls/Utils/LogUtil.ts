/*
-------------------------------------------
--- Список доступных отладочных cookie: ---
-------------------------------------------
DebugListVirtualScroll = 1 - отладка базового списочного виртуального скролла
DebugColumnsVirtualScroll = 1 - отладка виртуального скролла для контрола Controls/Columns
 */

export enum LogColorEnum {
    blue = '#8CABFF',
    black = '#000000',
    white = '#FFFFFF',
    red = '#F24C3D',
    green = '#7EAA92',
    transparent = 'transparent'
}

export interface ILogRenderProps {
    titleBackgroundColor?: LogColorEnum;
    messageBackgroundColor?: LogColorEnum;
    titleColor?: LogColorEnum;
    messageColor?: LogColorEnum;
}

export type TLogDataItem = [string, unknown];

export type TLogData = TLogDataItem[];

const DEFAULT_BG_COLOR = LogColorEnum.blue;
const DEFAULT_TEXT_COLOR = LogColorEnum.black;

interface IAddToLogProps {
    title: string;
    message: string;
    data?: TLogData;
    renderProps?: ILogRenderProps;
}

function consoleLog(props: IAddToLogProps) {
    const { title, message, data, renderProps } = props;
    const titleBackgroundColor = renderProps?.titleBackgroundColor || DEFAULT_BG_COLOR;
    const messageBackgroundColor = renderProps?.messageBackgroundColor || DEFAULT_BG_COLOR;
    const titleColor = renderProps?.titleColor || DEFAULT_TEXT_COLOR;
    const messageColor = renderProps?.messageColor || DEFAULT_TEXT_COLOR;
    const logArguments = [];
    let logText = '';

    if (typeof title !== 'undefined') {
        logText += `%c${title}`;
        logArguments.push(`background-color: ${titleBackgroundColor}; color: ${titleColor}`);
    }

    if (message !== '') {
        if (typeof title !== 'undefined') {
            logText += '%c\t';
            logArguments.push('background-color: default; color: default');
        }
        logText += `%c${message}`;
        logArguments.push(`background-color: ${messageBackgroundColor}; color: ${messageColor}`);
    }

    if (logText) {
        logArguments.unshift(logText);
    }

    if (data && data.length) {
        data.forEach((dataItem) => {
            logArguments.push(`${dataItem[0]} = `, dataItem[1], ';');
        });
    }

    if (logArguments.length) {
        // eslint-disable-next-line
        console.log.apply(null, logArguments);
    }
}

export type TGetLogPropsCallback = () => IAddToLogProps;

export function addToLog(
    cookieKey: string,
    logLevel: number,
    logPropsCallback: TGetLogPropsCallback
) {
    if (
        cookieKey !== undefined &&
        logLevel !== undefined &&
        typeof logPropsCallback === 'function'
    ) {
        const cookie = document && document.cookie
            .split(';')
            .find((elem) => elem.includes(`${cookieKey}=`));

        if (cookie) {
            const cookieValue = parseInt(cookie.split('=').pop(), 10);
            if (cookieValue >= logLevel) {
                const props = logPropsCallback();
                if (props) {
                    consoleLog(props);
                }
            }
        }
    }
}
