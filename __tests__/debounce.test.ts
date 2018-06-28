import { debounce } from '../src';

class debounceTest {
    runOnce() { }

    @debounce(100)
    sum(a: number, b: number): number {
        this.runOnce();
        return a + b;
    }
}

jest.useFakeTimers();

test('debounce a method', () => {
    const spy = jest.spyOn(debounceTest.prototype, "runOnce");

    let t = new debounceTest();
    t.sum(1,2); t.sum(3,4); t.sum(5, 6);
    jest.runAllTimers();
    

    expect(spy).toHaveBeenCalledTimes(1);
})