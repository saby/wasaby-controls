import { Logger } from 'UI/Utils';
import * as clone from 'Core/core-clone';
import { Memory } from 'Types/source';
import { RemoveWithConfirmation, IRemoveWithConfirmOptions } from 'Controls/listCommands';
import { ISelectionObject } from 'Controls/interface';
import { DialogOpener } from 'Controls/popup';

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

function resolveRemoveWithConfirmation(options: IRemoveWithConfirmOptions) {
    return new Promise((resolve) => {
        new RemoveWithConfirmation(options)
            .execute({})
            .then(() => {
                return resolve(true);
            })
            .catch(() => {
                return resolve(false);
            });
    });
}

describe('Controls/list_clean/ListCommands/RemoveProviderWithConfirm', () => {
    let source: Memory;
    let selection: ISelectionObject;

    beforeEach(() => {
        const _data = clone(data);

        selection = {
            selected: [1, 3, 5],
            excluded: [3],
        };

        source = new Memory({
            keyProperty: 'id',
            data: _data,
        });

        // to prevent throwing console error
        jest.spyOn(Logger, 'error').mockClear().mockImplementation();
    });

    it('removeWithConfirmation() should not remove without source', () => {
        const stubDialogOpener = jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((args) => {
                return Promise.resolve(args.templateOptions.closeHandler(true));
            });
        return resolveRemoveWithConfirmation({
            selection,
            source: undefined,
        }).then((result: boolean) => {
            // Ожидаем, что пользователь увидит окно подтверждения
            expect(stubDialogOpener).toHaveBeenCalled();

            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });

    it('removeWithConfirmation() should not remove with incorrect selection', () => {
        const stubDialogOpener = jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((args) => {
                return Promise.resolve(args.templateOptions.closeHandler(true));
            });

        // @ts-ignore
        return resolveRemoveWithConfirmation({
            source,
            // eslint-disable-next-line
            selection: [0, 1, 2],
        }).then((result: boolean) => {
            // Ожидаем, что пользователь увидит окно подтверждения
            expect(stubDialogOpener).toHaveBeenCalled();

            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });

    it('removeWithConfirmation() should not remove with undefined selection', () => {
        const stubDialogOpener = jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((args) => {
                return Promise.resolve(args.templateOptions.closeHandler(true));
            });

        // @ts-ignore
        return resolveRemoveWithConfirmation({ source }).then((result: boolean) => {
            // Ожидаем, что пользователь увидит окно подтверждения
            expect(stubDialogOpener).toHaveBeenCalled();

            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });

    it('removeWithConfirmation() should remove with correct selection', () => {
        const correctSelection = {
            selected: [1, 3, 5],
            excluded: [3],
        };
        const spyQuery = jest.spyOn(source, 'query').mockClear();
        const spyDestroy = jest.spyOn(source, 'destroy').mockClear();
        const stubDialogOpener = jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((args) => {
                return Promise.resolve(args.templateOptions.closeHandler(true));
            });
        return resolveRemoveWithConfirmation({
            source,
            selection: correctSelection,
        }).then((result: boolean) => {
            // Ожидаем, что пользователь увидит окно подтверждения
            expect(stubDialogOpener).toHaveBeenCalled();

            // Ожидаем, что удаление пройдёт успешно
            expect(result).toBe(true);
            expect(spyQuery).toHaveBeenCalled();
            expect(spyDestroy).toHaveBeenCalled();
        });
    });

    it('removeWithConfirmation() should work with empty selection', () => {
        const correctSelection = {
            selected: [],
            excluded: [3],
        };
        const stubDialogOpener = jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((args) => {
                expect(args.message).toEqual('Нет записей для обработки команды');
                return Promise.resolve(args.templateOptions.closeHandler(true));
            });
        return resolveRemoveWithConfirmation({
            source,
            selection: correctSelection,
        }).then((result: boolean) => {
            // Ожидаем, что пользователь увидит окно подтверждения "Нет записей"
            expect(stubDialogOpener).toHaveBeenCalled();

            // Ожидаем, что удаление не произойдёт, т.к. нечего удалять
            expect(result).toBe(false);
        });
    });

    it('Remove when selectedKeysCount===null', () => {
        const correctSelection = {
            selected: [null],
            excluded: [3],
        };
        const spyQuery = jest.spyOn(source, 'query').mockClear();
        const spyDestroy = jest.spyOn(source, 'destroy').mockClear();
        const stubDialogOpener = jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((args) => {
                return Promise.resolve(args.templateOptions.closeHandler(true));
            });
        return resolveRemoveWithConfirmation({
            source,
            selection: correctSelection,
            selectedKeysCount: null,
        }).then((result: boolean) => {
            // Ожидаем, что пользователь увидит окно подтверждения
            expect(stubDialogOpener).toHaveBeenCalled();

            // Ожидаем, что удаление пройдёт успешно
            expect(result).toBe(true);
            expect(spyQuery).toHaveBeenCalled();
            expect(spyDestroy).toHaveBeenCalled();
        });
    });
});
