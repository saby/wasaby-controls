import * as React from 'react';
import {
    IActionsProps as IBaseActionsProps,
    IAction,
} from 'Controls/interface';
import { Icon } from 'Controls/icon';
import 'css!Controls-Templates/itemTemplates';

const cssPrefix = 'Controls-Templates-Actions';

interface IActionsProps extends IBaseActionsProps {
    className?: string;
}

// TODO: Полноценно портировать на react itemActions
function Action({ id, title, icon }: IAction) {
    return (
        <div key={id} title={title}>
            {icon ? <Icon iconSize={'s'} icon={icon} /> : null}
            {title}
        </div>
    );
}

function getWrapperClassName(className: string): string {
    return `${className} ${cssPrefix}__wrapper`;
}

export function Actions({
    actions = [],
    className = '',
}: IActionsProps): React.ReactElement<IActionsProps> {
    return (
        <div className={getWrapperClassName(className)}>
            {actions.map(Action)}
        </div>
    );
}
