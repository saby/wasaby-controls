import { TKey, Direction } from 'Controls/interface';
import {
    ErrorViewMode,
    ErrorViewConfig,
    ErrorController,
} from 'Controls/error';

export type TErrorQueryConfig = {
    root?: TKey;
    loadKey?: TKey;
    direction?: Direction;
};

export function getErrorConfig(
    queryConfig: TErrorQueryConfig,
    error: Error
): Partial<ErrorViewConfig> {
    const { direction, root, loadKey } = queryConfig;
    let errorViewMode;

    if (direction && root === loadKey) {
        errorViewMode = ErrorViewMode.inlist;
    } else if (root !== loadKey) {
        errorViewMode = ErrorViewMode.dialog;
    } else {
        errorViewMode = ErrorViewMode.include;
    }

    const resultConfig = {
        mode: errorViewMode,
    };

    if (direction) {
        resultConfig.templateOptions = {
            showInDirection: direction,
        };
    }

    if (error) {
        resultConfig.error = error;
    }

    return resultConfig;
}

export function processError(
    errorController: ErrorController,
    config,
    theme: string
) {
    return errorController
        .process({
            error: config.error,
            theme,
            mode: config.mode || ErrorViewMode.include,
        })
        .then((errorConfig) => {
            if (config.templateOptions && errorConfig) {
                errorConfig.options = {
                    ...errorConfig.options,
                    ...config.templateOptions,
                };
            }
            return errorConfig;
        });
}
