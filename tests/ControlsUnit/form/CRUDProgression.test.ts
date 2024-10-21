import { readWithAdditionalFields } from 'Controls/_form/crudProgression';
import { PrefetchProxy, SbisService } from 'Types/source';
import { Model } from 'Types/entity';

describe('Controls/_form/crudProgression', () => {
    describe('readWithAdditionalFields()', () => {
        let provider;
        let lastName;
        let lastArgs;

        beforeEach(() => {
            provider = {
                call(name: string, args: unknown): Promise<unknown> {
                    lastName = name;
                    lastArgs = args;
                    return Promise.resolve("It's fine");
                },
            };
            lastName = undefined;
            lastArgs = undefined;
        });

        it("should call SbisService's provider read method with given key", () => {
            const source = new SbisService({
                provider,
                binding: { read: 'Read' },
            });

            readWithAdditionalFields(source, 'foo');
            expect(lastName).toEqual('Read');
            expect(lastArgs.ИдО).toEqual('foo');
        });

        it("should call SbisService's provider read method with given key and meta data", () => {
            const source = new SbisService({
                provider,
                binding: { read: 'Read' },
            });

            readWithAdditionalFields(source, 'foo', ['bar']);
            expect(lastName).toEqual('Read');
            expect(lastArgs.ИдО).toEqual('foo');
            expect(lastArgs.ДопПоля).toEqual(['bar']);
        });

        it('should call target source if Types/source:IDecorator is implemented', () => {
            const target = new SbisService({
                provider,
                binding: { read: 'Read' },
            });
            const source = new PrefetchProxy({ target });

            readWithAdditionalFields(source, 'foo');
            expect(lastName).toEqual('Read');
            expect(lastArgs.ИдО).toEqual('foo');
        });

        it("shouldn't call target source if Types/source:IDecorator contains preloaded data", () => {
            const read = {} as Model;
            const target = new SbisService({
                provider,
                binding: { read: 'Read' },
            });
            const source = new PrefetchProxy({ target, data: { read } });

            readWithAdditionalFields(source, 'foo');
            expect(lastName).not.toBeDefined();
            expect(lastArgs).not.toBeDefined();
        });
    });
});
