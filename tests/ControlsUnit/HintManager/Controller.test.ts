import { Controller, IRouteModel, IStepModel } from 'Controls/hintManager';
import { Model, format as entityFormat } from 'Types/entity';
import { RecordSet } from 'Types/collection';


describe('Controls/_hintManager/Controller', () => {
    let controllerInstance: Controller;

    const stepFormat: entityFormat.FormatDeclaration = [
        { name: 'id', type: 'string' },
        { name: 'order', type: 'integer' },
        { name: 'display', type: 'object' },
        { name: 'message', type: 'string' }
    ];

    const routeFormat: entityFormat.FormatDeclaration = [
        { name: 'id', type: 'string' },
        { name: 'scheme', type: 'recordset' }
    ];

    const getStep = (order: number): Model<IStepModel> => {
        const step = new Model({
            keyProperty: 'id',
            format: stepFormat
        });
        step.set('id', `id-${order + 1}`);
        step.set('order', order);
        step.set('display', { targetId: `[data-name="page-${order + 1}"]` });
        step.set('message', `Шаг ${order + 1}`);

        return step;
    };

    const getScheme = (stepsCount: number): RecordSet<IStepModel> => {
        const scheme = new RecordSet({
            keyProperty: 'id',
            format: stepFormat
        });

        for (let i = 0; i < stepsCount; i++) {
            const step = getStep(i);
            scheme.add(step);
        }
        return scheme;
    };

    const getRoute = (stepsCount: number): Model<IRouteModel> => {
        const route = new Model({
            keyProperty: 'id',
            format: routeFormat
        });
        route.set('id', 'some-id');
        route.set('scheme', getScheme(stepsCount));
        return route;
    };

    afterEach(() => {
        controllerInstance?.destroy();
    });

    describe('addStep', () => {
        it('new step is added correctly', () => {
            const stepsCount = 1;
            const route = getRoute(stepsCount);
            controllerInstance = new Controller(route);

            const order = stepsCount;
            const newStep = getStep(order);
            controllerInstance.addStep(newStep);

            expect(route.get('scheme').getCount()).toBe(stepsCount + 1);
            expect(route.get('scheme').at(order).get('message')).toBe(`Шаг ${order + 1}`);
        });

        it('adding step is replacing existed step', () => {
            const stepsCount = 1;
            const route = getRoute(stepsCount);
            controllerInstance = new Controller(route);

            const order = stepsCount - 1;
            const newStep = getStep(order);
            controllerInstance.addStep(newStep);

            expect(route.get('scheme').getCount()).toBe(stepsCount);
        });
    });

    describe('updateStep', () => {
        it('step is updated correctly', () => {
            const stepsCount = 2;
            const route = getRoute(stepsCount);
            controllerInstance = new Controller(route);

            const index = stepsCount - 1;
            const id = route.get('scheme').at(index).get('id');
            const newOrder = index + 1;
            const updatedStep = getStep(newOrder);
            controllerInstance.updateStep(id, updatedStep);

            expect(route.get('scheme').getCount()).toBe(stepsCount);
            expect(route.get('scheme').at(index).get('message')).toBe(`Шаг ${newOrder + 1}`);
        });
    });

    describe('removeStep', () => {
        it('step is removed correctly', () => {
            const stepsCount = 2;
            const route = getRoute(stepsCount);
            controllerInstance = new Controller(route);

            const index = 0;
            const id = route.get('scheme').at(index).get('id');
            controllerInstance.removeStep(id);

            expect(route.get('scheme').getCount()).toBe(stepsCount - 1);
        });
    });
});
