import { INameOptions } from 'Controls-Input/interface';
import { ReactNode } from 'react';
import { useSliceActions, useConnectedValue, useSelector } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import * as React from 'react';

interface IDecoratorPlaceholderProps extends INameOptions {
    children: ReactNode;
}

const TYPE_REPOSITORY = 'TypeRepository';
const CONSTRUCTOR_TYPE_SLICE = 'ConstructorSlice';

/**
 * Заглушка декоратора поля
 * @remark
 * По умолчанию ничего не выводит.
 * Если в типе конструктора включен флаг renderPlaceholderOnEmpty:
 *  - Если в контексте отсутствует объект - ничего не выводится
 *  - Если в контексте отсутствует поле - выводится заглушка с названием поля
 * @param props
 * @public
 */
function DecoratorPlaceholder(props: IDecoratorPlaceholderProps) {
    const sliceName = React.useMemo(() => {
        const [objName] = props.name;
        return objName;
    }, [props.name]);

    const { value, type } = useConnectedValue(props.name);
    const dataObjectSlice = useSliceActions(sliceName);
    const typeRepositorySlice = useSliceActions(TYPE_REPOSITORY);
    const renderPlaceholderEnabled = usePlaceholderVisibility();

    const typeSelector = React.useCallback(() => {
        return typeRepositorySlice?.getFieldType(props.name) ?? type?.getName();
    }, [type, typeRepositorySlice, props.name]);

    const typeDescription = useSelector<
        Slice,
        {
            titlePath: string;
        }
    >(typeSelector);

    if (!!value) {
        return props.children;
    }

    if (!dataObjectSlice || !renderPlaceholderEnabled) {
        return null;
    }

    return <DecoratorPlaceholderRender value={typeDescription?.titlePath ?? props.name} />;
}

function DecoratorPlaceholderRender(props: { value: string }) {
    return <span className={'tw-inline-block'}>{`[${props.value}]`}</span>;
}

function usePlaceholderVisibility(): boolean {
    const decoratorConfig = useDecoratorConfig();

    const renderPlaceholderOnEmpty = React.useMemo(() => {
        return decoratorConfig?.renderPlaceholderOnEmpty;
    }, [decoratorConfig]);

    if (!renderPlaceholderOnEmpty) {
        return false;
    }

    return renderPlaceholderOnEmpty ? true : false;
}

function useDecoratorConfig() {
    const constructorTypeSlice = useSliceActions(CONSTRUCTOR_TYPE_SLICE);

    const decoratorConfig = React.useMemo(() => {
        const constructorType = constructorTypeSlice?.state?.data;

        return constructorType?.decoratorConfig;
    }, [constructorTypeSlice]);

    return decoratorConfig ?? {};
}

DecoratorPlaceholder.displayName = 'Controls-Input/decoratorConnected:DecoratorPlaceholder';

export { DecoratorPlaceholder, DecoratorPlaceholderRender };
