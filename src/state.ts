interface DebounceState {
    lastInvokeTime: number;
    leading: boolean;
    maxing: boolean;
    trailing: boolean;

    lastArgs?: any[];
    lastThis?: any;
    maxWait?: number;
    result?: any;
    timerId?: number;
    lastCallTime?: number;
}

export {DebounceState};