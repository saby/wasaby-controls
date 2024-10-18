import fastUpdate from 'Controls/_stickyBlock/FastUpdate';

describe('Controls/_stickyBlock/FastUpdate', () => {
    describe('resetSticky', () => {
        afterEach(() => {
            // Почистим, потому что он очищается только после вызова методов measure или mutate, причем асинхронно.
            fastUpdate._stickyContainersForReset = [];
        });
        it('should add an element to reset', () => {
            const stickyHeaderElement = {};

            fastUpdate.resetSticky([stickyHeaderElement]);

            expect(fastUpdate._stickyContainersForReset.length).toBe(1);
            expect(fastUpdate._stickyContainersForReset).toContainEqual({
                container: stickyHeaderElement,
            });
        });
        it("should't add the same element to reset", () => {
            const stickyHeaderElement = {};

            fastUpdate.resetSticky([stickyHeaderElement]);
            fastUpdate.resetSticky([stickyHeaderElement]);

            expect(fastUpdate._stickyContainersForReset.length).toBe(1);
        });
    });
});
