import { ReactElement, MouseEventHandler } from 'react';
import { Button } from 'Controls/buttons';

interface IRequestFilterDetailsTemplateProps {
    openFilterPanel: MouseEventHandler<unknown>;
}

export default function (props: IRequestFilterDetailsTemplateProps): ReactElement {
    return (
        <div className={'controls-fontsize-l'}>
            Это может занять достаточно много времени или Вы можете{' '}
            <Button
                caption={'Настроить фильтр'}
                viewMode={'link'}
                onClick={props.openFilterPanel}
            />
        </div>
    );
}
