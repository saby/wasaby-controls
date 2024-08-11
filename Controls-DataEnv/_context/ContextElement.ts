import { IDataConfig, IDataFactory, Custom, TExtraValues } from 'Controls-DataEnv/dataFactory';
import { AbstractSlice, Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type ContextNode from './ContextNode';
import type { IContextElementChange } from './interface';

interface IContextElementProps {
    router?: IRouter;
    name: string;
    config: IDataConfig;
    loadResult: unknown;
    onChange: Function;
    onSnapshot: Function;
    parentNode: ContextNode;
}

function isSimpleElement(factoryName: string): boolean {
    const customSliceNames = [
        'Controls/dataFactory:Custom',
        'Controls-DataEnv/dataFactory:Custom',
        'Controls-DataEnv/dataFactory:CompatibleCustom',
    ];
    return customSliceNames.includes(factoryName);
}

function isObjectSliceState(state: unknown): state is Record<string, unknown> {
    return state instanceof Object;
}

function resolveExtraValues(
    sliceExtraValues: TExtraValues,
    dependencies: Record<string, ContextElement | undefined>
): {
    properties: Record<string, unknown>;
    extraValuesDependencies: Record<string, string | undefined>;
} {
    const properties: Record<string, unknown> = {};
    const extraValuesDependencies: Record<string, string | undefined> = {};

    sliceExtraValues?.forEach(({ propName, dependencyPropName, dependencyName, prepare }) => {
        let value = dependencies[dependencyName]?.getValue();
        extraValuesDependencies[dependencyName] = dependencies?.[dependencyName]
            ?.getParent()
            ?.getName();

        if (isSlice(value)) {
            const sliceState = value.state;

            if (!isObjectSliceState(sliceState)) {
                throw Error(
                    'ContextElement:::Указаны sliceExtraValues от слайса, состояние которого не является объектом, дальнейшая работа невозможна'
                );
            } else {
                value = sliceState[dependencyPropName];
            }
        }
        if (prepare) {
            value = prepare(value);
        }
        properties[propName] = value;
    });

    return {
        properties,
        extraValuesDependencies,
    };
}

function validateSliceConstructor(
    sliceConstructor: unknown,
    config: IDataConfig,
    name: string
): boolean {
    const abstractSliceConstructor = AbstractSlice.prototype.constructor;
    if (sliceConstructor === abstractSliceConstructor) {
        throw new Error(`Controls-DataEnv/context.createSlice::slice с именем ${name} не будет создан.
             В качестве слайса у фабрики ${config.dataFactoryName} задан абстрактный класс Controls-DataEnv/slice:AbstractSlice.
             Создание экземпляра абстрактного класса невозможно. Используйте Controls-DataEnv/slice:Slice`);
    }
    return true;
}

function isSlice(value: Slice | unknown): value is Slice {
    return value instanceof Slice;
}

export default class ContextElement {
    private _$props: IContextElementProps;
    private _$value: Slice | unknown;
    private readonly _$name: string;
    private readonly _$parentNode: ContextNode;
    private _$updater: Slice['setState'];
    private _$extraValuesDependencies: Record<string, string | undefined> = {};
    private readonly _$extraValues: TExtraValues | undefined;

    constructor(props: IContextElementProps) {
        this._$props = props;
        this._$name = props.name;
        this._$parentNode = props.parentNode;

        if (isSimpleElement(props.config.dataFactoryName)) {
            this._$value = props.loadResult;
        } else {
            this._$value = this._initSlice();
            this._initUpdater();
        }

        this._$extraValues = this._$props.config.dataFactoryArguments?.sliceExtraValues;
    }

    getLoadResult(): unknown {
        return this._$props.loadResult;
    }

    getValue(): Slice | unknown {
        return this._$value;
    }

    getName(): string {
        return this._$name;
    }

    getParent(): ContextNode {
        return this._$parentNode;
    }

    setState(newElementPartialState: IContextElementChange): void {
        if (this._$updater) {
            this._$updater(newElementPartialState);
        } else {
            this._$value = newElementPartialState;
        }
    }

    getData(): unknown {
        if (isSlice(this._$value)) {
            return this._$value.getData();
        } else {
            return this._$value;
        }
    }

    hasDependencyFromNode(name: string): boolean {
        return !!this._$extraValuesDependencies?.[name];
    }

    getExtraValues(): TExtraValues | undefined {
        return this._$extraValues;
    }

    private _resolveDataFactoryArguments(
        dataFactory: IDataFactory,
        config: IDataConfig,
        Router: IRouter | undefined
    ): IDataConfig['dataFactoryArguments'] {
        let dataFactoryArguments = config.dataFactoryArguments;
        const dependenciesResults: Record<string, unknown> = {};
        const valuesDependencies = ContextElement.getValuesDependencies(config);
        const dependenciesElements: Record<string, ContextElement | undefined> = {};

        valuesDependencies.forEach((depName) => {
            dependenciesElements[depName] = this.getParent().getElement(depName);
        });

        if (config.dependencies) {
            config.dependencies.forEach((dependenciesName) => {
                dependenciesResults[dependenciesName] =
                    this.getParent().getLoadResult(dependenciesName);
            });
        }

        if (dataFactory.getDataFactoryArguments) {
            dataFactoryArguments = dataFactory.getDataFactoryArguments(
                config.dataFactoryArguments,
                dependenciesResults,
                Router
            );
        }

        if (dataFactoryArguments?.sliceExtraValues) {
            const extraValues = resolveExtraValues(
                dataFactoryArguments.sliceExtraValues,
                dependenciesElements
            );
            dataFactoryArguments = { ...dataFactoryArguments, ...extraValues.properties };
            this._$extraValuesDependencies = extraValues.extraValuesDependencies;
        }

        return dataFactoryArguments;
    }

    protected _initUpdater() {
        if (isSlice(this._$value)) {
            const sliceSetStateObserver = (newElementPartialState: unknown) => {
                this._$props.onSnapshot(this._$props.name, newElementPartialState);
            };
            this._$updater = this._$value.setState.bind(this._$value);
            Object.defineProperty(this._$value, 'setState', {
                get(): any {
                    return sliceSetStateObserver;
                },
            });
        }
    }

    protected _initSlice(
        name: string = this._$props.name,
        loadResult = this._$props.loadResult,
        config = this._$props.config,
        changedCallback: Function = this._$props.onChange,
        Router: IRouter | undefined = this._$props.router
    ): Slice {
        const dataFactory = loadSync<IDataFactory>(config.dataFactoryName);
        const sliceCtr = dataFactory.slice || Custom.slice;
        const dataFactoryArguments = this._resolveDataFactoryArguments(dataFactory, config, Router);
        const isValueSimpleObject =
            loadResult instanceof Object &&
            loadResult?.constructor === Object &&
            Object.getPrototypeOf(loadResult) === Object.prototype;

        validateSliceConstructor(sliceCtr, config, name);

        return new sliceCtr({
            config: dataFactoryArguments || {},
            loadResult: isValueSimpleObject ? { ...loadResult } : loadResult,
            onChange: changedCallback,
            name,
        });
    }

    destroy(): void {
        if (isSlice(this._$value)) {
            this._$value.destroy();
        }

        this._$value = null;
    }

    static getDependencies(config: IDataConfig): string[] {
        const deps = config.dependencies || [];
        const valuesDeps = ContextElement.getValuesDependencies(config);

        return deps.concat(valuesDeps);
    }

    static getValuesDependencies(config: IDataConfig): string[] {
        const valuesDependencies: string[] = [];

        config.dataFactoryArguments?.sliceExtraValues?.forEach(({ dependencyName }) => {
            if (!valuesDependencies.includes(dependencyName)) {
                valuesDependencies.push(dependencyName);
            }
        });

        return valuesDependencies;
    }
}
