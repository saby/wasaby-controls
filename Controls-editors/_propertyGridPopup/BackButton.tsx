import { Button } from 'Controls/buttons';
import * as rk from 'i18n!Controls';

interface IResetButtonProps {
    onClick: () => void;
    className?: string;
    dataQa?: string;
}

export function BackButton({ onClick, className, dataQa }: IResetButtonProps) {
    return (
        <Button
            icon="icon-ArrowBack"
            viewMode="link"
            inlineHeight="l"
            iconStyle="primary"
            iconSize="s"
            tooltip={rk('Назад')}
            className={className}
            data-qa={dataQa}
            onClick={onClick}
        />
    );
}
