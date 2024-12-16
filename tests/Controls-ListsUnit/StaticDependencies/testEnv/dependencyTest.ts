import { expect } from '@jest/globals';
import type { MatcherFunction, SyncExpectationResult } from 'expect';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';

//# region Custom matcher

const matcherErrorMsg =
    'Если вы видите это сообщение, значит есть ошибка в матчере. Обратитесь в Интеракторы.';

const isLoaded: MatcherFunction = function (receivedName: unknown) {
    if (typeof receivedName !== 'string') {
        throw new TypeError('Эти данные должны быть строкового типа!');
    }

    const missingNeeded = `Ожидалось, что библиотека ${this.utils.printReceived(
        receivedName
    )} будет загружена.`;

    const existingUnneeded = `Ожидалось, что библиотека ${this.utils.printReceived(
        receivedName
    )} НЕ будет загружена.`;

    const isPass = ModulesLoader.isLoaded(receivedName);

    if (isPass) {
        return {
            pass: true,
            message: () => (this.isNot ? existingUnneeded : matcherErrorMsg),
        };
    } else {
        return {
            pass: false,
            message: () => (this.isNot ? existingUnneeded : missingNeeded),
        };
    }
};

const isModuleExists: MatcherFunction = async function (
    receivedName: unknown
): Promise<SyncExpectationResult> {
    if (typeof receivedName !== 'string') {
        throw new TypeError('Эти данные должны быть строкового типа!');
    }

    let isPass: boolean;
    try {
        isPass = !!(await ModulesLoader.loadAsync(receivedName));
    } catch (e) {
        isPass = false;
    }

    const fR = `${this.utils.printReceived(receivedName)}`;

    const doesntExistMsg =
        `Библиотеки ${fR} не существует!\n` + 'Проверьте правильно ли указано название библиотеки.';

    const existsMsg =
        `Библиотека ${fR} существует!\n` + `Ожидалось, что библиотека ${fR} не будет существовать.`;

    if (isPass) {
        return {
            pass: true,
            message: () => (this.isNot ? existsMsg : matcherErrorMsg),
        };
    } else {
        return {
            pass: false,
            message: () => (this.isNot ? existsMsg : doesntExistMsg),
        };
    }
};

expect.extend({
    isLoaded,
    isModuleExists,
});

declare module 'expect' {
    interface AsymmetricMatchers {
        isLoaded(): void;
        isModuleExists(): Promise<void>;
    }
    interface Matchers<R> {
        isLoaded(): R;
        isModuleExists(): Promise<R>;
    }
}

//# endregion Custom matcher

export default function dependencyTest(
    targetLib: string,
    neededLibs: string[],
    unneededLibs: string[]
): void {
    it(`Тестируем статические зависимости библиотеки ${targetLib}.`, async () => {
        // Проверим, что целевая и зависимые от нее библиотеки не загружены.
        [targetLib, ...neededLibs].forEach((name) => {
            expect(name).not.isLoaded();
        });

        // Загрузим ее и проверим что всё прошло успешно.
        try {
            await ModulesLoader.loadAsync(targetLib);
        } catch (error) {
            expect(() => error).not.toThrow();
        }

        // Проверим, что целевая и зависимые от нее библиотеки загрузились.
        [targetLib, ...neededLibs].forEach((name) => {
            expect(name).isLoaded();
        });

        // Проверим, что НЕ загрузились библиотеки, которые НЕ должны были загрузиться
        unneededLibs.forEach((name) => {
            expect(name).not.isLoaded();
        });

        // Проверим, что библиотеки, которые не должны были загрузиться вообще существуют.
        // Делаем это после всего, т.к. загрузка библиотеки может сайдэффектить.
        for (const name of unneededLibs) {
            await expect(name).isModuleExists();
        }
    });
}
