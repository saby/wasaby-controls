import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { IRouteModel, IStepModel } from 'Controls/hintManager';
import { TStyle } from 'Controls/popupTemplate';
import { IOnBeforeOpenCallbackParams } from 'Controls-demo/HintManager/mockedData/interface';

const STEPS_COUNT = 7;

const ON_BEFORE_OPEN_CALLBACK_PATH = 'Controls-demo/HintManager/mockedData/mockedCallbacks:onBeforeOpenCallback';

const createRoute = (routeId: string, schemeRawData: IStepModel[]): Model<IRouteModel> => {
    const route = new Model({
        keyProperty: 'id',
        format: [
            { name: 'id', type: 'string' },
            { name: 'scheme', type: 'recordset' },
            { name: 'display', type: 'object' },
        ],
    });
    route.set('id', routeId);
    route.set(
        'scheme',
        new RecordSet({
            keyProperty: 'id',
            rawData: schemeRawData,
        })
    );
    route.set('display', {});

    return route;
};

const getSchemeRawData = (hasMessages: boolean = true): IStepModel[] => {
    const schemeRawData = [];
    const targetSearchAreaSelector = '.controlsDemo-HintManager__stepTargetSearchArea';

    for (let i = 0; i < STEPS_COUNT; i++) {
        schemeRawData.push({
            id: `id-${i + 1}`,
            order: i,
            display: {
                targetId: `[data-name="page-${i + 1}"]`,
                targetSearchAreaSelector:
                    i === STEPS_COUNT - 1 ? targetSearchAreaSelector : undefined,
            },
            message: hasMessages ? `Шаг ${i + 1}` : undefined,
        });
    }

    return schemeRawData;
};

const getRoute = (hasMessages: boolean = true): Model<IRouteModel> => {
    const routeId = 'some-id';
    const schemeRawData = getSchemeRawData(hasMessages);
    return createRoute(routeId, schemeRawData);
};

const getCycleRoute = (): Model<IRouteModel> => {
    const cycleRoute = getRoute();
    cycleRoute.set('display', { isCycle: true });
    return cycleRoute;
};

const getOnlyHighlightRoute = (): Model<IRouteModel> => {
    const onlyHighlightRoute = getRoute(false);
    onlyHighlightRoute.set('display', { isOnlyHighlightAllowed: true });
    return onlyHighlightRoute;
};

const getRouteWithOnBeforeOpenCallback = (): Model<IRouteModel> => {
    const routeWithOnBeforeOpenCallback = getRoute();
    const onBeforeOpenCallback = (params: IOnBeforeOpenCallbackParams) => {
        return loadAsync(ON_BEFORE_OPEN_CALLBACK_PATH).then((callback: Function) => {
            return callback(params);
        });
    };
    routeWithOnBeforeOpenCallback.addField({ name: 'onBeforeOpenCallback', type: 'object' });
    routeWithOnBeforeOpenCallback.set('onBeforeOpenCallback', onBeforeOpenCallback);
    return routeWithOnBeforeOpenCallback;
};

const getRouteWithOnBeforeOpenCallbackPath = (): Model<IRouteModel> => {
    const routeWithOnBeforeOpenCallbackPath = getRoute();
    routeWithOnBeforeOpenCallbackPath.addField({ name: 'onBeforeOpenCallback', type: 'string' });
    routeWithOnBeforeOpenCallbackPath.set('onBeforeOpenCallback', ON_BEFORE_OPEN_CALLBACK_PATH);
    return routeWithOnBeforeOpenCallbackPath;
};

const getRouteForHighlighterOffsetSetting = (): Model<IRouteModel> => {
    const routeId = 'highlighter-settings-id';
    const schemeRawData = [
        {
            id: 'id-1',
            order: 0,
            display: {
                targetId: '[data-name="highlighterOffsetTarget"]',
            },
            message: 'Подсказка',
        },
    ];
    return createRoute(routeId, schemeRawData);
};

const getStylishRoute = (style: TStyle): Model<IRouteModel> => {
    const routeId = `${style}-route-id`;
    const schemeRawData = [
        {
            id: `${style}-id-1`,
            order: 0,
            display: {
                targetId: `[data-name="${style}HintTarget"]`,
                style,
            },
            message: style,
        },
    ];
    return createRoute(routeId, schemeRawData);
};

const getRouteWithDifferentStyles = (): Model<IRouteModel> => {
    const routeId = 'colored-id';
    const styles = ['danger', 'warning', 'success'];
    const schemeRawData = [];

    for (let i = 0; i < styles.length; i++) {
        schemeRawData.push({
            id: `id-${i + 1}`,
            order: i,
            display: {
                targetId: `[data-name="page-${i + 1}"]`,
                style: styles[i],
            },
            message: `Шаг ${i + 1}`,
        });
    }

    return createRoute(routeId, schemeRawData);
};

export {
    getRoute,
    getCycleRoute,
    getOnlyHighlightRoute,
    getRouteWithOnBeforeOpenCallback,
    getRouteWithOnBeforeOpenCallbackPath,
    getRouteForHighlighterOffsetSetting,
    getStylishRoute,
    getRouteWithDifferentStyles,
};
