import {makeScene2D, Node, Txt, Rect} from '@motion-canvas/2d';
import {
    all,
    any, chain, createRef, delay, easeInCubic,
    easeInExpo, easeInOutBack, easeInOutBounce, easeOutBack, easeOutCirc, easeOutCubic,
    easeOutExpo,
    map,
    Reference,
    tween, useLogger, waitFor
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {

    const primaryColor = '#33ff00';
    const backgroundColor = '#0A0A0A';
    const lineHeight = '1%';

    const cursorChar = '█';

    const textStyle = {
        fontWeight: 500,
        fontSize: 210,
        fontFamily: 'Source Code Pro',
        x: 10
    }

    const title = createRef<Txt>();
    const rect = createRef<Rect>();

    const maskedRect = createRef<Rect>();
    const maskedTitle = createRef<Txt>();

    const mask = createRef<Node>();

    view.add(
        <>
            <Node
                ref={mask}
                cache>
                <Txt
                    ref={maskedTitle}
                    fill={primaryColor}
                    text={'RodakDev()'}
                    scale={[1.5, 1.5]}
                    {...textStyle}
                />
                <Rect
                    ref={maskedRect}
                    fill={primaryColor}
                    width={'100%'}
                    height={'80%'}
                    compositeOperation={'source-out'}
                />
            </Node>
            <Node cache>
                <Txt
                    ref={title}
                    fill={primaryColor}
                    scale={[0.75, 0.75]}
                    {...textStyle}
                />
                <Rect
                    ref={rect}
                    fill={primaryColor}
                    width={'100%'}
                    height={'80%'}
                    compositeOperation={'destination-out'}
                />
            </Node>
        </>
    );
    rect().x(-view.width());
    maskedRect().x(-view.width());

    mask().scale(0);

    yield* waitFor(0.1);
    title().text(cursorChar)
    const typeSpeed = 0.08;

    yield* waitFor(typeSpeed);
    yield* typeText(title, '', 'Rodak', cursorChar, typeSpeed);
    yield* waitFor(0.1);
    yield* typeText(title, 'Rodak', 'Dev', cursorChar, typeSpeed);
    yield* waitFor(0.2);
    yield* typeText(title, 'RodakDev', '(', cursorChar, typeSpeed);
    yield* waitFor(0.15);
    yield* typeText(title, 'RodakDev(', ')', cursorChar, typeSpeed);
    title().text('RodakDev()');

    yield* tweenScale(title, 0.8, 0.75, 0.5, easeInExpo);

    mask().scale(1);
    yield* all(
        tweenScale(title, 0.33, 0.5, 1.5, easeOutExpo),
        tweenScale(maskedTitle, 0.33, 0.5, 1.5, easeOutExpo),
        delay(
            0.25,
            all(
                tween(0.25, value => {
                    rect().x(map(-view.width(), 0, value))
                }),
                tween(0.25, value => {
                    maskedRect().x(map(-view.width(), 0, value))
                }),
            )
        ),
    );

    const lines = [
        createRef<Rect>(),
        createRef<Rect>(),
    ];
    const semicolon = createRef<Txt>();
    view.add(
        <>
            <Rect
                ref={lines[0]}
                fill={primaryColor}
                height={lineHeight}
                width={'100%'}
            />
            <Rect
                ref={lines[1]}
                fill={primaryColor}
                height={lineHeight}
                width={'100%'}
            />
            <Txt
                ref={semicolon}
                text=';'
                fill={primaryColor}
                {...textStyle}
                fontSize={330}
            />
        </>
    );
    const lineOff = rect().height()/2 - lines[0]().height()/2;
    lines[0]().y(-lineOff);
    lines[1]().y(lineOff);

    semicolon().x((view.width()/2 + (title().position().x + title().width()/2)) / 2);
    semicolon().y(-semicolon().height()*0.075);
    semicolon().scale(0);

    yield* any(
        all(
            tween(0.25, value => {
                rect().x(map(0, view.width(), value))
            }),
            tween(0.25, value => {
                maskedRect().x(map(0, view.width(), value))
            }),
        ),
        tweenScale(title, 0.25, 1.5, 1, easeOutCubic),
        tweenScale(maskedTitle, 0.25, 1.5, 1, easeOutCubic)
    );

    yield* tween(0.5, value => {
        semicolon().scale(easeOutBack(value, 0.1, 1));
    });

    yield* waitFor(0.75);
});

function* tweenScale(ref: Reference<any>, seconds: number, from: number, to: number, easeFunction: (value: number) => number){
    yield* tween(seconds, value => {
        ref().scale(map(from, to, easeFunction(value)));
    });
}

function* typeText(text: Reference<Txt>, left: string, toType: string, cursorChar: string, typeSpeed: number){
    yield* tween(typeSpeed * toType.length, value => {
        text().text(left + toType.substring(0, Math.floor(map(0, toType.length, value))) + cursorChar);
    });
}