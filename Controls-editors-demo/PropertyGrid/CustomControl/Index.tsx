import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IPersonType } from './meta';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import { forwardRef, useCallback, useRef, useState, useContext } from 'react';
import { DataContext } from 'Controls-DataEnv/context';

const Index = forwardRef((_, ref) => {
    const [value, setValue] = useState({});
    const btnOpenerRef = useRef(null);
    const dataContext = useContext(DataContext);

    const openEditorHandler = useCallback(() => {
        const opener = new ObjectEditorOpener();

        opener.open({
            metaType: IPersonType,
            autoSave: true,
            value,
            onChange: setValue,
            dataContext,
            popupOptions: {
                actionOnScroll: 'track',
                closeOnOutsideClick: true,
                target: btnOpenerRef.current,
                fittingMode: 'overflow',
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'left',
                },
                direction: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
                dataContext,
            },
        });
    }, [value]);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <button ref={btnOpenerRef} onClick={openEditorHandler}>
                Открыть кастомный редактор
            </button>
        </div>
    );
});

//@ts-ignore
Index.getLoadConfig = (): Record<string, IDataConfig<unknown>> => {
    return {
        MySlice: {
            dataFactoryName:
                'Controls-editors-demo/PropertyGrid/EditorDataLoader/DataFactory:demoFactory',
            dataFactoryArguments: {
                data: 'Данные из глобального контекста',
            },
        },
    };
};

export default Index;
