import rk = require('i18n!Controls');

interface IPasswordVisibilityButtonProps {
    revealable?: boolean;
    toggleVisibilityHandler?: () => void;
    passwordVisible?: boolean;
    horizontalPadding?: string;
    isVisibleButton?: () => boolean;
}

export default function PasswordVisibilityButton(props: IPasswordVisibilityButtonProps) {
    return props.revealable ? (
        <div
            title={props.passwordVisible ? rk('Скрыть') : rk('Показать')}
            className={`controls-PasswordInput__showPassword${
                !props.isVisibleButton() ? ' ws-invisible' : ''
            } controls-PasswordInput__showPassword_margin-${props.horizontalPadding}${
                props.passwordVisible ? ' icon-Hide' : ' icon-ShowBig'
            } controls-PasswordInput_${props.passwordVisible ? 'visible' : 'invisible'}`}
            onClick={props.toggleVisibilityHandler}
        />
    ) : (
        <div />
    );
}
