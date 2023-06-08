/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import 'Controls/dataFactory';
import { Provider } from 'Controls-DataEnv/context';
import { IDataConfig } from 'Controls/dataFactory';
import { TKey } from 'Controls/interface';
import DataFormatConverter from './DataFormatConverter';
import { Logger } from 'UI/Utils';

interface IOptions extends IControlOptions {
    value?: ILoadResults;
    configs?: IDataConfigs;
    changedCallback?: (store: unknown) => void;
    children: JSX.Element;
    loadResults?: Record<TKey, unknown>;
}

type IDataConfigs = Record<TKey, IDataConfig>;
type ILoadResults = {
    [key in keyof IDataConfigs]: unknown;
};

export const CompatibleContextProvider = React.memo(
    React.forwardRef((props: IOptions, ref: React.RefObject<HTMLElement>): JSX.Element => {
        const isOldOptionsFormat = props.value && !(props.loadResults && props.configs);
        const isEmptyProps = !props.value && !(props.loadResults && props.configs);
        const isOldOptionsWithNew = props.value && props.loadResults && props.configs;
        // Удалить этот кейс после
        // https://online.sbis.ru/opendoc.html?guid=60331dc7-15f4-4126-9ee1-a40b410424af&client=3
        const isNotExistConfigs =
            props.configs &&
            props.loadResults &&
            Object.keys(props.loadResults).length !== Object.keys(props.configs).length;
        if (isEmptyProps) {
            Logger.error(
                "Не переданы опции loadResults и configs в провайдер контекста 'Controls/context:ContextOptionsProvider'." +
                    ' Убедитесь, что загрузка данных для страницы сконфигурирована правильно. Подробнее: ' +
                    "'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        } else if (isOldOptionsWithNew) {
            Logger.error(
                "В провайдер контекста 'Controls/context:ContextOptionsProvider' передана лишняя опция value." +
                    ' Убедитесь, что загрузка данных для страницы сконфигурирована правильно. Поробнее: ' +
                    "'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        } else if (isOldOptionsFormat) {
            // TODO: после проекта
            //  https://online.sbis.ru/opendoc.html?guid=1b925033-8a49-4938-8f6a-938fa12dbf40&client=3
            // Logger.warn('Предзагрузка страницы сконфигурирована устаревшим способом, рекомендуется перейти на
            // новый вариант настройки. Подробнее: ' +
            //    '\'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/
            //    create-page/accordion/content/prefetch-config/\'');
        } else if (DataFormatConverter.isOldDataFormat(props.configs)) {
            /*
            Logger.error('В провайдер контекста \'Controls/context:ContextOptionsProvider\'
             передана конфигурация в старом формате. ' +
                ' Убедитесь, что загрузка данных для страницы сконфигурирована правильно. Поробнее: ' +
                '\'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration
                /create-page/accordion/content/prefetch-config/\''); */
        }

        const { configs, loadResults } = React.useMemo(() => {
            if (isOldOptionsFormat) {
                return {
                    configs: DataFormatConverter.convertLoadResultsToFactory(props.value),
                    loadResults: props.value,
                };
            } else if (isNotExistConfigs) {
                return {
                    configs: DataFormatConverter.convertLoadResultsToFactory(
                        props.loadResults,
                        props.configs
                    ),
                    loadResults: props.loadResults,
                };
            } else if (DataFormatConverter.isOldDataFormat(props.configs)) {
                return {
                    configs: DataFormatConverter.convertLoadResultsToFactory(props.loadResults),
                    loadResults: props.loadResults,
                };
            } else {
                return {
                    configs: props.configs,
                    loadResults: props.loadResults,
                };
            }
        }, [props.loadResults, props.value, props.configs]);

        return (
            <Provider
                loadResults={loadResults}
                configs={configs}
                changedCallback={props.changedCallback}
            >
                {React.cloneElement(props.children, {
                    ...props,
                    forwardedRef: ref,
                    value: undefined,
                    configs: undefined,
                    loadResults: undefined,
                    changedCallback: undefined,
                })}
            </Provider>
        );
    })
);
