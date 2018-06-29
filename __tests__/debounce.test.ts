import { debounce } from '../src';

class debounceTest {
    run() { }

    @debounce(100)
    sum(a: number, b: number): number {
        this.run();
        return a + b;
    }

    @debounce(100, {immediate: true})
    sub(a: number, b: number): number {
        this.run();
        return a - b;
    }
}

jest.useFakeTimers();

test('debounce a method', () => {
    const spy = jest.spyOn(debounceTest.prototype, "run");

    let t = new debounceTest();
    t.sum(1,2); t.sum(3,4); t.sum(5, 6);
    jest.runAllTimers();
    

    expect(spy).toHaveBeenCalledTimes(1);
})

test('debounce a method with immediate', () => {
    const spy = jest.spyOn(debounceTest.prototype, "run");

    let t = new debounceTest();
    t.sub(1,2); t.sub(3,4); t.sub(5, 6);
    jest.runAllTimers();
    

    expect(spy).toHaveBeenCalledTimes(2);
})