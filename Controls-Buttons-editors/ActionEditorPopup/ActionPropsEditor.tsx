import { IActionOptions } from 'Controls-Buttons/interface';
import { DataContext } from 'Controls-DataEnv/context';
import * as React from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Back } from 'Controls/heading';
import { useCallback, useState } from 'react';
import { Logger } from 'UI/Utils';

const META_PROP = 'propsMeta';

type Props = {
    name: string;
    value: IActionOptions;
    onChange: (value: IActionOptions) => void;
};
export function ActionPropsEditor(props: Props) {
    const { value, onChange, name } = props;
    const [action, setAction] = useState(value.actionProps);
    const onInput = useCallback(
        (actionProps) => {
            setAction(actionProps);
            return onChange({ ...value, actionProps });
        },
        [onChange, value.actionProps]
    );
    const clearAction = () => {
        onChange({
            id: null,
            actionProps: null,
        });
    };
    const slice = React.useContext(DataContext)?.[name];
    const data = slice?.state?.items?.getRecordById?.(value.id);
    if (!data) {
        Logger.warn('ActionPropsEditor: не доступен контекст действий.');
        return null;
    }

    return (
        <>
            <Back
                caption={data.get('title')}
                onClick={clearAction}
                className={'actionConfig__propertyGrid-back_button'}
            />
            <PropertyGrid
                metaType={data.get(META_PROP)}
                value={action}
                onChange={onInput}
                className={'actionConfig__propertyGrid-body'}
            />
        </>
    );
}
