// eslint-disable-next-line
/* eslint-disable deprecated-anywhere */

import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport } from 'Controls/interface';
import * as React from 'react';

const { useRef, useEffect, useMemo, useState } = React;

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

interface IUseStoreDeprecatedParams {
    values?: string[];
    handlers?: {
        [key: string]: (data: unknown) => any;
    };
}

interface IUseDeprecatedStoreResult {
    values?: {
        [key: string]: unknown;
    };
}

export function useDeprecatedStore(props: IUseStoreDeprecatedParams): IUseDeprecatedStoreResult {
    const subscribesRef = useRef([]);
    const requiredValues = props.values || [];
    const [count, setCount] = useState(0);
    const values = useMemo(() => {
        const initValues = {};
        requiredValues.forEach((valueName) => {
            Object.defineProperty(initValues, valueName, {
                get(): any {
                    return getStore().get(valueName);
                },
                set(v: any) {
                    if (this[valueName] !== v) {
                        getStore().dispatch(valueName, v);
                        setCount(count + 1);
                    }
                },
            });
        });
        return initValues;
    }, [props.values, count]);
    useEffect(() => {
        subscribesRef.current = Object.entries(props.handlers || {}).map(([key, handler]) => {
            return getStore().onPropertyChanged(key, handler as unknown as any);
        });
        return () => {
            subscribesRef.current.forEach((id) => {
                getStore().unsubscribe(id);
            });
        };
    }, []);
    return { values };
}
