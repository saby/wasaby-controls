import { useContext, memo, forwardRef } from 'react';
import { default as DataContextCompatible } from 'Controls/_context/DataContextCompatible';
import { TemplateFunction } from 'UICommon/base';

interface IProps {
    innerComponent: TemplateFunction;
}

function DataContextCompatibleConsumer(props: IProps, ref): JSX.Element {
    const dataContextCompatibleValue = useContext(DataContextCompatible);
    return (
        <props.innerComponent
            {...props}
            dataContextCompatibleValue={dataContextCompatibleValue}
            forwardedRef={ref}
        />
    );
}

export default memo(forwardRef(DataContextCompatibleConsumer));