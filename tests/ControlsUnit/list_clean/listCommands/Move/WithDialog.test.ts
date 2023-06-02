import { Control } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { CrudEntityKey, Memory } from 'Types/source';
import { IHashMap } from 'Types/declarations';
import { Model } from 'Types/entity';
import * as clone from 'Core/core-clone';
import { DialogOpener, IBasePopupOptions, Confirmation } from 'Controls/popup';
import {
    IMoveWithDialogOptions,
    MoveWithDialog as MoveAction,
} from 'Controls/listCommands';
import { ISelectionObject } from 'Controls/interface';
import { IMoverDialogTemplateOptions } from 'Controls/moverDialog';

const data = [
    {
        id: 1,
        folder: null,
        'folder@': true,
    },
    {
        id: 2,
        folder: null,
        'folder@': null,
    },
    {
        id: 3,
        folder: null,
        'folder@': null,
    },
    {
        id: 4,
        folder: 1,
        'folder@': true,
    },
    {
        id: 5,
        folder: 1,
        'folder@': null,
    },
    {
        id: 6,
        folder: null,
        'folder@': null,
    },
];

function createFakeModel(rawData: {
    id: number;
    folder: number;
    'folder@': boolean;
}): Model {
    return new Model({
        rawData,
        keyProperty: 'id',
    });
}

function mockDialogOpener(
    openFunction?: (args: IBasePopupOptions) => Promise<any>
): any {
    let popupId = null;
    return {
        open: jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((popupOptions: IBasePopupOptions) => {
                popupId = 'POPUP_ID';
                return openFunction(popupOptions);
            }),
        isOpened: jest
            .spyOn(DialogOpener.prototype, 'isOpened')
            .mockClear()
            .mockImplementation(() => {
                return !!popupId;
            }),
    };
}

describe('ControlsUnit/list_clean/listCommands/Move/WithDialog', () => {
    let config: IMoveWithDialogOptions;
    let source: Memory;
    let stubLoggerError: any;
    let validPopupArgs: IBasePopupOptions;
    let selection: ISelectionObject;
    let callCatch: boolean;

    beforeEach(() => {
        const _data = clone(data);

        // fake opener
        const opener = new Control({});

        source = new Memory({
            keyProperty: 'id',
            data: _data,
        });

        selection = {
            selected: [1, 3, 5, 7],
            excluded: [3],
        };

        validPopupArgs = {
            opener,
            templateOptions: {
                source,
                movedItems: selection.selected,
                keyProperty: 'id',
                nodeProperty: 'folder@',
                parentProperty: 'folder',
            } as Partial<IMoverDialogTemplateOptions>,
            closeOnOutsideClick: true,
            template: 'fakeTemplate',
        };

        config = {
            parentProperty: 'folder',
            source,
            popupOptions: {
                opener: validPopupArgs.opener,
                templateOptions: {
                    keyProperty: (
                        validPopupArgs.templateOptions as IMoverDialogTemplateOptions
                    ).keyProperty,
                    nodeProperty: (
                        validPopupArgs.templateOptions as IMoverDialogTemplateOptions
                    ).nodeProperty,
                    parentProperty: (
                        validPopupArgs.templateOptions as IMoverDialogTemplateOptions
                    ).parentProperty,
                },
                template: validPopupArgs.template,
            },
        };

        // to prevent throwing console error
        stubLoggerError = jest
            .spyOn(Logger, 'error')
            .mockClear()
            .mockImplementation();

        callCatch = false;
    });

    describe('constructor', () => {
        // Если при перемещении методом moveWithDialog() в popupOptions.templateOptions передан source,
        // то он используется в диалоге перемещения вместо source, переданного в контроллер
        it('moveWithDialog() + source set within popupOptions.templateOptions object', () => {
            const source2: Memory = new Memory({
                keyProperty: 'id',
                data: clone(data),
            });
            // to prevent popup open
            mockDialogOpener((args) => {
                expect(
                    (args.templateOptions as { source: Memory }).source
                ).not.toBe(source);
                expect(
                    (args.templateOptions as { source: Memory }).source
                ).toBe(source2);
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            config.popupOptions.templateOptions = {
                ...(config.popupOptions.templateOptions as object),
                source: source2,
            };
            return new MoveAction(config)
                .execute({ selection, filter: { myProp: 'test' } })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        it('moveWithDialog() + source !== null', () => {
            const stubMove = jest
                .spyOn(source, 'move')
                .mockClear()
                .mockImplementation(
                    (
                        items: CrudEntityKey[],
                        target: CrudEntityKey,
                        meta?: IHashMap<any>
                    ) => {
                        // assertion here
                        expect(target).toEqual('ROOT');
                        return Promise.resolve();
                    }
                );
            mockDialogOpener((args) => {
                return Promise.resolve(args.eventHandlers.onResult('ROOT'));
            });
            config.popupOptions.templateOptions = {
                ...(config.popupOptions.templateOptions as object),
                root: 'ROOT',
            };
            return new MoveAction(config)
                .execute({ selection, filter: { myProp: 'test' } })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // assertion is above
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubMove).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Передан popupOptions без template при перемещении методом moveWithDialog()
        it('moveWithDialog() + popupOptions.template is not set', () => {
            // to prevent popup open
            const stubConfirmation = jest
                .spyOn(Confirmation, 'openPopup')
                .mockClear()
                .mockImplementation((args) => {
                    return Promise.resolve(true);
                });
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            return new MoveAction(config)
                .execute({
                    selection,
                    filter: { myProp: 'test' },
                    popupOptions: {},
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю, что перемещение провалится из-за некорректно заданного шаблона
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(stubConfirmation).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Все статические параметры должны соответствовать эталонам при перемещении методом moveWithDialog()
        it('moveWithDialog() + necessary and static popupOptions', () => {
            mockDialogOpener((args) => {
                expect(args.opener).toEqual(validPopupArgs.opener);
                expect(args.templateOptions).toEqual(
                    validPopupArgs.templateOptions
                );
                expect(args.closeOnOutsideClick).toEqual(
                    validPopupArgs.closeOnOutsideClick
                );
                expect(args.template).toEqual(validPopupArgs.template);
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            return new MoveAction(config)
                .execute({
                    popupOptions: {
                        opener: validPopupArgs.opener,
                        templateOptions: {
                            keyProperty: (
                                validPopupArgs.templateOptions as IMoverDialogTemplateOptions
                            ).keyProperty,
                            nodeProperty: (
                                validPopupArgs.templateOptions as IMoverDialogTemplateOptions
                            ).nodeProperty,
                            parentProperty: (
                                validPopupArgs.templateOptions as IMoverDialogTemplateOptions
                            ).parentProperty,
                        },
                        template: validPopupArgs.template,
                    },
                    selection,
                    filter: { myProp: 'test' },
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Случай, когда movePosition === on, parentProperty === undefined, и source instanceof Memory
        it('moveWithDialog() + _parentProperty is not set', () => {
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            return new MoveAction(config)
                .execute({
                    selection,
                    filter: { myProp: 'test' },
                    parentProperty: undefined,
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки, брошенной в source
                    expect(callCatch).toBe(true);
                });
        });

        it('moveWithDialog() + config passed as execute() argument', () => {
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            return new MoveAction()
                .execute({ ...config, selection, filter: { myProp: 'test' } })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });
    });
});
