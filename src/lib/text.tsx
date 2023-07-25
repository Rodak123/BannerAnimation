import {chain, map, Reference, tween, useLogger} from "@motion-canvas/core";
import {Layout, Txt} from "@motion-canvas/2d";

export function* flashCursorFor(txt: Reference<Txt>, seconds: number, flashDuration: number = 0.4, cursor: string = '█'){
    const flashAmount = seconds / flashDuration / 2;
    for (let i = 0; i < flashAmount; i++) {
        yield* flashCursorOnce(txt, flashDuration, cursor)
    }
}

export function* flashCursorOnce(txt: Reference<Txt>, seconds: number = 0.4, cursor: string = '█') {
    const baseText = txt().text();
    yield* chain(
        tween(seconds, value => {
            txt().text(baseText + cursor);
        }),
        tween(seconds, value => {
            txt().text(baseText);
        }),
    );
}

export function* typeText(text: Reference<Txt>, left: string, toType: string, typeSpeed: number, cursorChar: string = '█'){
    yield* tween(typeSpeed * toType.length, value => {
        text().text(left + toType.substring(0, Math.floor(map(0, toType.length, value))) + cursorChar);
    });
}