import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IRouteModel, IStepModel } from 'Controls/hintManager';

const STEPS_COUNT = 7;

const createRoute = (routeId: string, schemeRawData: IStepModel[]): Model<IRouteModel> => {
    const route = new Model({
        keyProperty: 'id',
        format: [
            { name: 'id', type: 'string' },
            { name: 'scheme', type: 'recordset' },
            { name: 'display', type: 'object' }
        ]
    });
    route.set('id', routeId);
    route.set('scheme', new RecordSet({
        keyProperty: 'id',
        rawData: schemeRawData
    }));
    route.set('display', {});

    return route;
}

const getSchemeRawData = (hasMessages: boolean = true): IStepModel[] => {
    const schemeRawData = [];
    const targetSearchAreaSelector = '.controlsDemo-HintManager__stepTargetSearchArea';

    for (let i = 0; i < STEPS_COUNT; i++) {
        schemeRawData.push({
            id: `id-${i + 1}`,
            order: i,
            display: {
                targetId: `[data-name="page-${i + 1}"]`,
                targetSearchAreaSelector: i === STEPS_COUNT - 1 ? targetSearchAreaSelector : undefined,
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
    const onBeforeOpenCallback = 'Controls-demo/HintManager/mockedData/mockedCallbacks:onBeforeOpenCallback';
    routeWithOnBeforeOpenCallback.set('onBeforeOpenCallback', onBeforeOpenCallback);
    return routeWithOnBeforeOpenCallback;
};

const getRouteForHighlighterOffsetSetting = (): Model<IRouteModel> => {
    const routeId = 'highlighter-settings-id'
    const schemeRawData = [{
        id: 'id-1',
        order: 0,
        display: {
            targetId: '[data-name="highlighterOffsetTarget"]',
        },
        message: 'Подсказка',
    }];
    return createRoute(routeId, schemeRawData);
}

export {
    getRoute,
    getCycleRoute,
    getOnlyHighlightRoute,
    getRouteWithOnBeforeOpenCallback,
    getRouteForHighlighterOffsetSetting
};
