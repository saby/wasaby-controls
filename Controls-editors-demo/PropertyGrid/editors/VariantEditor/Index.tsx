import { PersonType } from './meta';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useState, useMemo, useEffect, useCallback, forwardRef } from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Checkbox } from 'Controls/checkbox';

export default forwardRef(function VariantEditor(props: any, ref) {
    const [value, setValue] = useState({
        name: 'Сергей',
        surname: 'Михайлов',
        job: {
            element_id: 'engineer',
            data: {
                speciality: {
                    element_id: 'programmer',
                    data: {
                        programmingLanguage: 'JavaScript',
                        experience: '10',
                    },
                },
                salary: '100000',
            },
        },
    });

    const [showTooltip, setShowTooltip] = useState(false);

    const [loadResults, setLoadResults] = useState(null);
    const providerConfigs = useMemo<Record<string, any>>(() => {
        return {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType: PersonType,
                },
            },
        };
    }, [PersonType]);

    const changeShowTooltip = useCallback(() => {
        setShowTooltip(!showTooltip);
    }, [showTooltip]);

    useEffect(() => {
        Loader.load(providerConfigs).then(setLoadResults);
    }, [providerConfigs]);

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth500" ref={ref}>
            <div>Настройки</div>
            <div>
                <Checkbox
                    value={showTooltip}
                    onValueChanged={changeShowTooltip}
                    caption={'Показвыать подсказки'}
                />
            </div>
            <br />
            {!!loadResults && (
                <Provider configs={providerConfigs} loadResults={loadResults}>
                    <PropertyGrid
                        metaType={PersonType}
                        value={value}
                        onChange={setValue}
                        storeId={'MetaTypeEditors'}
                        captionColumnWidth={'minmax(220px, max-content)'}
                        showTooltip={showTooltip}
                    />
                </Provider>
            )}
            <div>
                <textarea
                    style={{ width: '500px' }}
                    value={JSON.stringify(value, null, 2)}
                    readOnly={true}
                    rows={20}
                ></textarea>
            </div>
        </div>
    );
});
