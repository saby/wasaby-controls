import { useEffect, useRef } from 'react';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { DataSetBindingFacade } from 'Frame/base';

type TUseResetAfterDataSetChange = (
    connectedPropName: string,
    onChange: Function,
    defaultValues: {}
) => void;

export const useResetAfterDataSetChange: TUseResetAfterDataSetChange = (
    connectedPropName,
    onChange,
    defaultValues
) => {
    const facadeName = useRef<string | null>(null);
    const isMount = useRef(false);

    const [bindingFacade] = useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    useEffect(() => {
        if (!isMount.current) {
            isMount.current = true;
            facadeName.current = bindingFacade?.getDataSetName?.() as string;
        }
    }, []);

    useEffect(() => {
        const name = bindingFacade?.getDataSetName?.();
        if (
            isMount.current &&
            ((name && name !== facadeName.current) || (!name && !!facadeName.current))
        ) {
            facadeName.current = name;
            setTimeout(() => {
                onChange(defaultValues, { multiple: true });
            }, 0);
        }
    }, [bindingFacade, onChange]);
};
