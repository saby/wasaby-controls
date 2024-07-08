import { useConnectedValue, parseConnectedBinding } from 'Controls-DataEnv/context';
import { INameOptions } from 'Controls-Input/interface';
import { ReactNode } from 'react';

interface IDesignTimeDecoratorProps extends INameOptions {
    children: ReactNode;
    className: string;
}

/**
 * Базовый декоратор для дизайн-тайма.
 * @remark если данных в контексте нет, то выводим привязку.
 * @param props
 * @constructor
 */
function BaseDesignTimeDecorator(props: IDesignTimeDecoratorProps) {
    const { name, children, className } = props;

    const { value, type } = useConnectedValue(name);

    if (value === undefined || value === null) {
        const typeName = type?.getName();
        return <span className={className}>{`[${typeName ? typeName : name}]`}</span>;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
}

export { BaseDesignTimeDecorator };
