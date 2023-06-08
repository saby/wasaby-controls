import { IMoveWithDialogOptions, MoveWithDialog as MoveAction } from 'Controls/listCommands';
import { CrudEntityKey, Memory } from 'Types/source';
import { Model } from 'Types/entity';
import * as clone from 'Core/core-clone';
import { ISelectionObject } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { DialogOpener, IBasePopupOptions } from 'Controls/popup';

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

function mockDialogOpener(openFunction?: (args: IBasePopupOptions) => Promise<any>): any {
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

function createFakeModel(rawData: { id: number; folder: number; 'folder@': boolean }): Model {
    return new Model({
        rawData,
        keyProperty: 'id',
    });
}

describe('ControlsUnit/list_clean/listCommands/Move/BeforeMoveCallback', () => {
    let beforeMoveCallback;
    let selection: ISelectionObject;
    let stubLoggerError: any;
    let spySourceQuery: any;
    let source: Memory;
    let callCatch: boolean;

    function getOptions(options?: Partial<IMoveWithDialogOptions>): IMoveWithDialogOptions {
        return {
            parentProperty: 'parent',
            popupOptions: {
                beforeMoveCallback,
                opener: {},
                templateOptions: {},
                template: 'PopUpTemplate',
            },
            source,
            sorting: [],
            ...options,
        };
    }

    beforeEach(() => {
        const _data = clone(data);
        beforeMoveCallback = undefined;
        source = new Memory({
            keyProperty: 'id',
            data: _data,
        });
        selection = {
            selected: [1],
            excluded: [],
        };

        spySourceQuery = jest.spyOn(source, 'move').mockClear();

        // to prevent throwing console error
        stubLoggerError = jest.spyOn(Logger, 'error').mockClear().mockImplementation();

        callCatch = false;
    });

    it('-beforeMoveCallback; call moveInSource', () => {
        mockDialogOpener((args) => {
            return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
        });

        return new MoveAction(getOptions())
            .execute({ selection })
            .then(jest.fn())
            .catch(() => {
                callCatch = true;
            })
            .finally(() => {
                expect(spySourceQuery).toHaveBeenCalled();
                expect(stubLoggerError).not.toHaveBeenCalled();
                expect(callCatch).toBe(false);
            });

        // asserts are above
    });
    it('beforeMoveCallback => true; call moveInSource', () => {
        beforeMoveCallback = (selection: ISelectionObject, target: Model | CrudEntityKey) => {
            return true;
        };
        mockDialogOpener((args) => {
            return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
        });

        return new MoveAction(getOptions())
            .execute({ selection })
            .then(jest.fn())
            .catch(() => {
                callCatch = true;
            })
            .finally(() => {
                expect(spySourceQuery).toHaveBeenCalled();
                expect(stubLoggerError).not.toHaveBeenCalled();
                expect(callCatch).toBe(false);
            });

        // asserts are above
    });
    it('beforeMoveCallback => Promise.resolve(); call moveInSource', () => {
        beforeMoveCallback = (selection: ISelectionObject, target: Model | CrudEntityKey) => {
            return Promise.resolve();
        };
        mockDialogOpener((args) => {
            return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
        });

        return new MoveAction(getOptions())
            .execute({ selection })
            .then(jest.fn())
            .catch(() => {
                callCatch = true;
            })
            .finally(() => {
                expect(spySourceQuery).toHaveBeenCalled();
                expect(stubLoggerError).not.toHaveBeenCalled();
                expect(callCatch).toBe(false);
            });

        // asserts are above
    });
    it("beforeMoveCallback => false; don't call moveInSource", () => {
        beforeMoveCallback = (selection: ISelectionObject, target: Model | CrudEntityKey) => {
            return false;
        };
        mockDialogOpener((args) => {
            return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
        });

        return new MoveAction(getOptions())
            .execute({ selection })
            .then(jest.fn())
            .catch(() => {
                callCatch = true;
            })
            .finally(() => {
                expect(spySourceQuery).not.toHaveBeenCalled();
                expect(stubLoggerError).not.toHaveBeenCalled();
                expect(callCatch).toBe(true);
            });

        // asserts are above
    });
    it("beforeMoveCallback => Promise<false>; don't call moveInSource", () => {
        beforeMoveCallback = (selection: ISelectionObject, target: Model | CrudEntityKey) => {
            return Promise.reject();
        };
        mockDialogOpener((args) => {
            return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
        });

        return new MoveAction(getOptions())
            .execute({ selection })
            .then(jest.fn())
            .catch(() => {
                callCatch = true;
            })
            .finally(() => {
                expect(spySourceQuery).not.toHaveBeenCalled();
                expect(stubLoggerError).not.toHaveBeenCalled();
                expect(callCatch).toBe(true);
            });

        // asserts are above
    });
    it('beforeMoveCallback from constructor params; call moveInSource', () => {
        beforeMoveCallback = (selection: ISelectionObject, target: Model | CrudEntityKey) => {
            return true;
        };
        mockDialogOpener((args) => {
            return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
        });

        return new MoveAction({
            parentProperty: 'parent',
            beforeMoveCallback,
            source,
            sorting: [],
        })
            .execute({ selection })
            .then(jest.fn())
            .catch(() => {
                callCatch = true;
            })
            .finally(() => {
                expect(spySourceQuery).toHaveBeenCalled();
                expect(stubLoggerError).not.toHaveBeenCalled();
                expect(callCatch).toBe(false);
            });

        // asserts are above
    });
});
