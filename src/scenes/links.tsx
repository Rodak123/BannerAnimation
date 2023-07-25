import {Layout, makeScene2D, Img, Txt} from '@motion-canvas/2d';
import {
    all, chain,
    createRef,
    delay,
    easeOutBack,
    Reference,
    sequence,
    tween, waitFor,
} from "@motion-canvas/core";
import {transitionGrid} from "../lib/transition";

import itchioLogo from '../../images/itchio-logo-textless-white.svg';
import githubMark from '../../images/github-mark-white.svg';
import {flashCursorFor} from "../lib/text";

export default makeScene2D(function* (view) {
    const primaryColor = '#33ff00';

    const itchioRef = createRef<Img>();
    const githubRef = createRef<Img>();

    const linkStyle = {
        width: view.width() / 8
    }

    const layoutLinkStyle = {
        gap: linkStyle.width/4,
        width: linkStyle.width,
        scale: 0,
        layout: true,
    }

    const textStyle = {
        fontWeight: 500,
        fontSize: 210,
        fontFamily: 'Source Code Pro',
    }

    const smallTextSize = {
        ...textStyle,
        fontSize: 64
    }

    const title = createRef<Txt>();

    view.add(
        <>
            <Layout
                direction={'column'}
                width={'100%'}
                gap={view.height() * 0.075}
                layout>
                <Txt
                    ref={title}
                    text={'<Contact'}
                    fill={primaryColor}
                    {...textStyle}
                />
                <Layout
                    direction={'row'}
                    width={'100%'}
                    justifyContent={'space-around'}
                    layout>
                    <Layout
                        ref={itchioRef}
                        direction={'column'}
                        alignItems={'center'}
                        {...layoutLinkStyle}>
                        <Img
                            src={itchioLogo}
                            {...linkStyle}
                        />
                        <Txt
                            text={'rodakdev.itch.io'}
                            fill={primaryColor}
                            {...smallTextSize}
                        />
                    </Layout>
                    <Layout
                        ref={githubRef}
                        direction={'column'}
                        alignItems={'center'}
                        {...layoutLinkStyle}>
                        <Img
                            src={githubMark}
                            {...linkStyle}
                        />
                        <Txt
                            text={'github.com/Rodak123'}
                            fill={primaryColor}
                            {...smallTextSize}
                        />
                    </Layout>
                </Layout>
                <Txt
                    text={'/>'}
                    fill={primaryColor}
                    {...textStyle}
                />
            </Layout>
        </>
    );

    const linkImgs = [itchioRef, githubRef];

    let transitionGridIn = {
        gridNode: new Layout({}),
        duration: 0
    };
    yield* sequence(
        0.1,
        transitionGrid('in', view, primaryColor, transitionGridIn),
        flashCursorForTransitionDuration(title, transitionGridIn),
    )
    transitionGridIn.gridNode.remove();

    let transitionGridOut = {
        gridNode: new Layout({}),
        duration: 0
    };
    yield* all(
        sequence(0.2,
            ...linkImgs.map(linkImg =>
                tween(0.5, value => {
                    linkImg().scale(easeOutBack(value, 0, 1));
                })
            )
        ),
        flashCursorFor(title, 2),
        delay(
            1.9,
            transitionGrid('out', view, '#0a0a0a', transitionGridOut)
        )
    );
    //transitionGridOut.gridNode.remove();
});

function* flashCursorForTransitionDuration(txt: Reference<Txt>, transitionGridOutput: {gridNode: Layout, duration: number}, flashDuration: number = 0.4, cursor: string = '█'){
    yield* flashCursorFor(txt, transitionGridOutput.duration, flashDuration, cursor);
}