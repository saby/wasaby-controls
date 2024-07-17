import { useConnectedValue, useSlice } from 'Controls-DataEnv/context';
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
    const typeRepositorySlice = useSlice('TypeRepository');

    if (value === undefined || value === null) {
        const typeName = type?.getName();
        const typeDescription = typeRepositorySlice.getFieldType(typeName);
        return (
            <span className={className}>{`[${
                typeDescription?.titlePath ?? typeName ?? name
            }]`}</span>
        );
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
}

export { BaseDesignTimeDecorator };
