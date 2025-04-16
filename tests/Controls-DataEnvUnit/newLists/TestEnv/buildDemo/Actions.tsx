import * as React from 'react';
import { ListSlice } from 'Controls-DataEnv/list';
import { Orchestrator } from 'Controls-DataEnv/dispatcher';

const BUTTONS_WRAPPER_STYLE: React.CSSProperties = {
    padding: 10,
};

const BUTTON_STYLE: React.CSSProperties = {
    padding: '5px 10px',
    marginRight: 20,
    marginBottom: 20,
};

const BUTTON_READONLY_STYLE: React.CSSProperties = {
    pointerEvents: 'none',
    opacity: 0.5,
};

const getButtonStyle = (readOnly: boolean) => {
    if (!readOnly) {
        return BUTTON_STYLE;
    }
    return {
        ...BUTTON_STYLE,
        ...BUTTON_READONLY_STYLE,
    };
};

export type TAction<TSlice extends ListSlice> = {
    name: string;
    description?: string;
    dataQa?: string;
    action: (props: { slice: TSlice }) => void | Promise<void>;
};

export type TActionsProps<TSlice extends ListSlice> = {
    slice: TSlice;
    actions: TAction<TSlice>[];
};

export function Actions<TSlice extends ListSlice>({ actions, slice }: TActionsProps<TSlice>) {
    const [isReadOnly, setIsReadOnly] = React.useState(false);
    const orchestrator = React.useMemo(
        () =>
            new Orchestrator({
                onRun: () => {
                    setIsReadOnly(true);
                },
                onIdle: () => {
                    setIsReadOnly(false);
                },
            }),
        []
    );

    React.useEffect(() => {
        const names = actions.map(({ name }) => name).sort();
        const unique = Array.from(new Set(names)).sort();

        if (names.join('') !== unique.join('')) {
            throw Error('Ошибка настройки демо примера. Названия экшенов должны быть уникальны!');
        }
    }, [actions]);

    return (
        <div style={BUTTONS_WRAPPER_STYLE}>
            {actions.map(({ name, description, dataQa, action }) => (
                <button
                    key={name}
                    title={description || name}
                    data-qa={dataQa || name}
                    style={getButtonStyle(isReadOnly)}
                    onClick={() => {
                        const result = action({ slice: slice as TSlice });

                        if (result instanceof Promise) {
                            orchestrator.registerPendingPromise(name, result);
                        }
                    }}
                >
                    {name}
                </button>
            ))}
        </div>
    );
}
