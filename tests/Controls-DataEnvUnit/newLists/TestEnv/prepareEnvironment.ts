/**
 * @jest-environment jsdom
 */
import rawSerializer from 'Controls-DataEnvUnit/newLists/TestEnv/rawSnapshotSerializer';
import { WasabyEvents } from 'UICore/Events';
import { unmountComponentAtNode } from 'react-dom';
import { MockConsole } from 'Controls-DataEnvUnit/newLists/TestEnv/mockConsole';
import { Guid } from 'Types/entity';

type SetupTestEnvArgs = Partial<Record<keyof SetupTestEntities, boolean>>;
type FullSetupTestEnvArgs = Record<keyof SetupTestEntities, true>;

type SetupTestEnvReturn<Args extends SetupTestEnvArgs = SetupTestEnvArgs> = {
    [K in keyof Args]: K extends keyof SetupTestEntities
        ? Args[K] extends true
            ? SetupTestEntities[K]
            : never
        : never;
};

type SetupTestEntities = {
    container: HTMLDivElement;
    mockConsole: MockConsole;
    guidMock: jest.SpyInstance;
    dateToISOStringMock: jest.SpyInstance;
};

type EnvEntityMapper = {
    [K in keyof SetupTestEntities]: () => SetupTestEntities[K];
};

const mapper = {
    container: prepareContainer,
    mockConsole: prepareMockConsole,
    guidMock: prepareGuidMock,
    dateToISOStringMock: prepareSystemTimeMock,
};

export const envDefaultConfiguration: FullSetupTestEnvArgs = Object.keys(mapper).reduce(
    (acc, key) => ({ [key]: true, ...acc }),
    {} as FullSetupTestEnvArgs
);

export function setupTestEnv(): SetupTestEnvReturn<FullSetupTestEnvArgs>;
export function setupTestEnv<Args extends SetupTestEnvArgs = SetupTestEnvArgs>(
    args: Args
): SetupTestEnvReturn<Args>;
export function setupTestEnv<Args extends SetupTestEnvArgs = SetupTestEnvArgs>(
    args?: Args
): SetupTestEnvReturn<Args> {
    const configuration = args ?? (envDefaultConfiguration as Args);
    return Object.keys(configuration).reduce((acc, key) => {
        if (configuration[key as keyof Args]) {
            // @ts-expect-error Нужно понять как точно соотносить mapper[key]
            acc[key] = mapper[key as keyof EnvEntityMapper]();
        }

        return acc;
    }, {} as SetupTestEnvReturn<Args>) as SetupTestEnvReturn<Args>;
}

function prepareContainer(): HTMLDivElement {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        container = null;
    });

    // @ts-expect-error инициализация происходит в beforeEach;
    return container;
}

function prepareMockConsole(): MockConsole {
    const mockConsole = MockConsole.getInstance();

    expect.addSnapshotSerializer(rawSerializer);

    beforeAll(() => {
        mockConsole.init();
    });

    beforeEach(() => {
        mockConsole.clearHistory();
    });

    afterEach(() => {
        // если ошибка в консоли ожидаема, необходимо в самом тесте вызвать mockConsole.clearHistory
        expect(mockConsole.errors.length).toBe(0);
    });

    afterAll(() => {
        mockConsole.destroy();
    });

    return mockConsole;
}

function prepareGuidMock(): jest.SpyInstance {
    let GuidMock: jest.SpyInstance;

    beforeEach(() => {
        let counter = 0;
        GuidMock = jest.spyOn(Guid, 'create').mockImplementation(() => `uniqueId${counter++}`);
    });

    afterEach(() => {
        GuidMock.mockRestore();
    });

    // @ts-expect-error инициализация происходит в beforeEach;
    return GuidMock;
}

function prepareSystemTimeMock(): jest.SpyInstance {
    let DateToISOStringMock: jest.SpyInstance;

    beforeEach(() => {
        DateToISOStringMock = jest
            .spyOn(Date.prototype, 'toISOString')
            .mockReturnValue('2000-01-01T00:00:00.000Z');
    });

    afterEach(() => {
        DateToISOStringMock.mockRestore();
    });

    // @ts-expect-error инициализация происходит в beforeEach;
    return DateToISOStringMock;
}
