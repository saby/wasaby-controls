import {
    AnchorHTMLAttributes,
    FocusEventHandler,
    forwardRef,
    KeyboardEventHandler,
    MouseEventHandler,
    ReactNode,
    Ref,
    TouchEventHandler,
} from 'react';
import { useReadonly } from 'UI/Contexts';
import { IControlProps, TFontSize } from 'Controls/interface';
import { FocusRoot } from 'UI/Focus';

/**
 * Интерфейс для кнопки BasicButton
 * @public
 */
export interface IBasicButtonProps extends IControlProps {
    /**
     * Контент кнопки
     */
    children: ReactNode;
    // блок для совместимости, чтобы использовать компонент в ButtonBase без костылей
    'ws-autofocus'?: boolean;
    autofocus?: boolean;
    testName?: string;
    id?: string;
    name?: string;
    loading?: boolean;
    contrastBackground?: boolean;
    // конец блока совместимости
    /**
     * Определяет состояние кнопки включена/выключена
     */
    toggled?: boolean;
    /**
     * Режим полупрозрачного отображения кнопки.
     */
    translucent?: 'light' | 'dark' | string;
    tabIndex?: number;
    /**
     * Адрес документа, на который следует перейти.
     */
    href?: string;
    /**
     * Стиль отображения кнопки.
     * @variant primary
     * @variant secondary
     * @variant success
     * @variant danger
     * @variant warning
     * @variant info
     * @variant unaccented
     * @variant default
     * @variant pale
     * @variant navigation
     * @variant brand
     * @variant 'string'
     * @default secondary
     */
    buttonStyle?: string;
    /**
     * Режим отображения кнопки.
     * @variant outlined В виде обычной кнопки по-умолчанию.
     * @variant filled В виде обычной кнопки c заливкой.
     * @variant link В виде гиперссылки.
     * @variant ghost В виде кнопки для панели инструментов.
     * @variant squared В виде квадратной кнопки.
     * @default outlined
     */
    viewMode?: string;
    /**
     * Размер кнопки
     */
    buttonSize?: TFontSize | string;
    /**
     * Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
     */
    tooltip?: string;
    /**
     * Указывает, как открыть связанный документ
     */
    target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
    /**
     * Событие клика на кнопку
     */
    onClick?: MouseEventHandler<HTMLElement>;
    onTouchStart?: TouchEventHandler<HTMLElement>;
    onMouseDown?: MouseEventHandler<HTMLElement>;
    onMouseEnter?: MouseEventHandler<HTMLElement>;
    onMouseOver?: MouseEventHandler<HTMLElement>;
    onMouseMove?: MouseEventHandler<HTMLElement>;
    onMouseLeave?: MouseEventHandler<HTMLElement>;
    onKeyPress?: KeyboardEventHandler<HTMLElement>;
    onKeyDown?: KeyboardEventHandler<HTMLElement>;
    onFocus?: FocusEventHandler<HTMLElement>;
    onDeactivated?: () => void;
}

function useDataAttrs(props: Record<string, unknown>): Record<string, unknown> {
    const attrs: Record<string, unknown> = {};
    Object.keys(props).forEach((key) => {
        if (key.indexOf('data-') === 0) {
            attrs[key] = props[key];
        }
    });
    return attrs;
}

/**
 * Сам каркас для кнопки.  За выравнивание содержимого внутри кнопки и добавление отступов отвечает прикладной разработчик. Позволяет вставить любой контент без ограничений.
 *
 * @remark
 * Стоит использовать в том случае, когда стоит задача отобразить содержимое внутри кнопки в 2 и более строки. Либо в случаях, когда необходимо реализовать кнопку, со своими отступами.
 * Для большинства задач стоит использовать {@link Controls/buttons:Button Controls/buttons:Button}
 * @param props
 * @param ref
 * @public
 * @demo Controls-demo/Buttons/BasicButton/Index
 */
function Button(props: IBasicButtonProps, ref: Ref<HTMLElement>) {
    const { children, buttonStyle, viewMode, buttonSize, href, contrastBackground, translucent } =
        props;
    const isContrast =
        typeof contrastBackground === 'undefined' ? viewMode === 'filled' : contrastBackground;
    const readOnly = useReadonly(props);
    const buttonType = viewMode === 'link' || viewMode === 'linkButton' ? 'linkButton' : 'button';
    let className =
        `controls-BaseButton controls-Button_${
            readOnly || props.loading ? 'readonly' : 'clickable'
        }` +
        ` controls-Button_bg-${isContrast ? 'contrast' : 'same'}` +
        `${props.toggled ? ' controls-Button_toggled' : ''}` +
        ` controls-${buttonType}-style controls-button_${viewMode}-style controls-button_size-${buttonSize}`;
    if (translucent && !readOnly) {
        className += ` controls-button_mode-${
            props.viewMode === 'ghost' ? 'ghost' : 'button'
        }_style-translucent-${translucent}`;
    } else {
        className += ` controls-${buttonType}_${viewMode}-${
            readOnly ? 'readonly' : buttonStyle
        }-style${props.toggled ? '_toggled' : ''}`;
    }
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <FocusRoot
            {...useDataAttrs(props)}
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=aeb87bef-4cfb-4fc0-8398-ba9ed2f45165
            test_name={props.testName}
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=aa1742dc-ffca-4d34-acfb-529a0e88fcba
            name={props.name}
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=b79e0480-c8c8-4aef-abae-335b2a3d8088
            id={props.id}
            style={props.style}
            autofocus={props['ws-autofocus'] || props.autofocus}
            tabIndex={props.tabIndex}
            as={href ? 'a' : 'span'}
            href={href}
            target={href ? props.target : undefined}
            className={className}
            ref={ref}
            title={props.tooltip}
            onClick={props.onClick}
            onTouchStart={props.onTouchStart}
            onMouseDown={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}
            onMouseOver={props.onMouseOver}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onKeyPress={props.onKeyPress}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            onDeactivated={props.onDeactivated}
        >
            {children}
        </FocusRoot>
    );
}

const BasicButton = forwardRef(Button);
export default BasicButton;
