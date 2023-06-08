import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IRouteModel, IStepModel } from 'Controls/hintManager';

const STEPS_COUNT = 7;

const getSchemeRawData = (hasMessages: boolean = true): IStepModel[] => {
    const schemeRawData = [];

    for (let i = 0; i < STEPS_COUNT; i++) {
        schemeRawData.push({
            id: `id-${i + 1}`,
            order: i,
            display: {
                targetId: `[data-name="page-${i + 1}"]`
            },
            message: hasMessages ? `Шаг ${i + 1}` : undefined
        });
    }

    return schemeRawData;
};

const getRoute = (hasMessages: boolean = true): Model<IRouteModel> => {
    const route = new Model({
        keyProperty: 'id',
        format: [
            { name: 'id', type: 'string' },
            { name: 'scheme', type: 'recordset' },
            { name: 'display', type: 'object' }
        ]
    });
    route.set('id', 'some-id');
    route.set('scheme', new RecordSet({
        keyProperty: 'id',
        rawData: getSchemeRawData(hasMessages)
    }));
    route.set('display', {});

    return route;
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

export {
    getRoute,
    getCycleRoute,
    getOnlyHighlightRoute
};
