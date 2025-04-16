import { useContext, memo, forwardRef, ForwardedRef } from 'react';
import { default as DataContextCompatible } from 'Controls/_contextDeprecated/DataContextCompatible';
import { TemplateFunction } from 'UICommon/Base';

interface IProps {
    innerComponent: TemplateFunction;
}

function DataContextCompatibleConsumer(props: IProps, ref: ForwardedRef<object>): JSX.Element {
    const dataContextCompatibleValue = useContext(DataContextCompatible);
    return (
        <props.innerComponent
            {...props}
            dataContextCompatibleValue={dataContextCompatibleValue}
            _dataOptionsValue={dataContextCompatibleValue}
            forwardedRef={ref}
        />
    );
}

export default memo(forwardRef(DataContextCompatibleConsumer));
