import { DebounceOptions } from './options';
import { DebounceState } from './state';

function debounce(wait: number, options?: DebounceOptions) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => {
        let func: Function = descriptor.value;
        wait = +wait || 0;

        let state:DebounceState = {
            lastInvokeTime: 0,
            leading: false,
            maxing: false,
            trailing: true
        }

        if(options !== undefined) {
            state.leading = !!options.leading;
            state.maxing = 'maxWait' in options;
            state.maxWait = state.maxing ? Math.max(+options.maxWait || 0, wait) : state.maxWait;
            state.trailing = 'trailing' in options ? !!options.trailing : state.trailing;
        }

        let invoke = (time: number):any => {
            const args = state.lastArgs;
            const self = state.lastThis;

            state.lastArgs = state.lastThis = undefined;
            state.lastInvokeTime = time;
            state.result = func.apply(self, args);

            return state.result;
        }

        let leadingEdge = (time: number): any => {
            state.lastInvokeTime = time;
            state.timerId = setTimeout(timerExpired, wait);
            return state.leading ? invoke(time) : state.result;
        }

        let remaining = (time: number): number => {
            const timeSinceLastCall = time - state.lastCallTime;
            const timeSinceLastInvoke = time - state.lastInvokeTime;
            const timeWaiting = wait - timeSinceLastCall;

            return state.maxing ? Math.min(timeWaiting, state.maxWait - timeSinceLastInvoke) : timeWaiting;
        }

        let shouldInvoke = (time:number): boolean => {
            const timeSinceLastCall = time - state.lastCallTime;
            const timeSinceLastInvoke = time - state.lastInvokeTime;
            return (state.lastCallTime === undefined || (timeSinceLastCall >= wait) ||
                (timeSinceLastCall < 0) || (state.maxing && timeSinceLastInvoke >= state.maxWait));
        }

        let timerExpired = () => {
            const time = Date.now();
            if(shouldInvoke(time)) { return trailingEdge(time); }

            state.timerId = setTimeout(timerExpired, remaining(time));
        }

        let trailingEdge = (time: number) => {
            state.timerId = undefined;
            if(state.trailing && state.lastArgs) {
                return invoke(time);
            }
            state.lastArgs = state.lastThis = undefined;
            return state.result;
        }

        let cancel = () => {
            if(state.timerId !== undefined) {
                clearTimeout(state.timerId);
            }
            state.lastInvokeTime = 0;
            state.lastArgs = state.lastCallTime = state.lastThis = state.timerId = undefined;
        }

        let flush = () => {
            return state.timerId === undefined ? state.result : trailingEdge(Date.now());
        }

        let pending = () => { return state.timerId !== undefined; }

        interface F { (): any; cancel:Function; flush: Function; pending: Function;}

        let debounced = <F>((...args: any[]): any => {
            const time = Date.now();
            const isInvoking = shouldInvoke(time);

            state.lastArgs = args;
            state.lastThis = target;
            state.lastCallTime = time;

            if(isInvoking) {
                if(state.timerId === undefined) {
                    return leadingEdge(state.lastCallTime);
                }
                if(state.maxing) {
                    state.timerId = setTimeout(timerExpired, wait);
                    return invoke(state.lastCallTime);
                }
            }
            if(state.timerId === undefined) {
                state.timerId = setTimeout(timerExpired, wait);
            }
            return state.result;
        })

        debounced.cancel = cancel;
        debounced.flush = flush;
        debounced.pending = pending;

        descriptor.value = debounced;
    }
}

export { debounce }