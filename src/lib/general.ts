import {map, Reference, tween} from "@motion-canvas/core";

export function* tweenScale(ref: Reference<any>, seconds: number, from: number, to: number, easeFunction: (value: number) => number){
    yield* tween(seconds, value => {
        ref().scale(map(from, to, easeFunction(value)));
    });
}