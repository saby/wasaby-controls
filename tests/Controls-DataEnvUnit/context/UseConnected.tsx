import { useConnectedValue, useSlice } from 'Controls-DataEnv/context';

import { Model } from 'Types/entity';

interface IConnectedProps {
    name: string[];
    setOnChange?: Function;
    setUpdateTypeRepository?: Function;
}

export function TestConnectedEditor(props: IConnectedProps) {
    const { value, type, onChange } = useConnectedValue<Model | string>(props.name);
    const typeRepository = useSlice('TypeRepository');

    props.setUpdateTypeRepository?.((value: Partial<unknown>) => {
        // @ts-ignore
        typeRepository?.update(value);
    });

    props.setOnChange?.(onChange);

    return (
        <div className={'test-data'}>{`${value instanceof Model ? value.get('id') : value}.${(
            type as any
        )?.getType()}`}</div>
    );
}
