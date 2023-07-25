import {Layout, Rect, View2D} from "@motion-canvas/2d";
import {all, sequence, tween, useLogger} from "@motion-canvas/core";


function createTransitionGrid(view: View2D, squaresY: number, fill: string, scale: number){
    const squareSize = view.height() / squaresY;
    const squaresX = Math.ceil(view.width() / squareSize);

    let gridContainer: {
        gridNode: Layout
        grid: Rect[][]
    };
    gridContainer = {
        grid: [],
        gridNode: null
    };

    const rectStyle = {
        width: squareSize,
        height: squareSize,
        fill: fill,
        scale: scale
    };

    const cols = [];
    for (let j = 0; j < squaresX; j++) {
        const col = [];
        const squares: Rect[] = [];
        for (let i = 0; i < squaresY + (j%2); i++) {
            const rect = new Rect({
                ...rectStyle
            });
            squares.push(rect);
            col.push(rect)
        }
        gridContainer.grid.push(col)
        cols.push(new Layout({
            direction: 'column',
            width: '100%',
            height: '100%',
            layout: true,
            children: squares
        }));
    }

    const gridNode = new Layout({
        direction: 'row',
        width: '100%',
        height: '100%',
        x: (view.width() - squareSize * squaresX),
        layout: true,
        children: cols
    });

    view.add(gridNode);
    gridContainer.gridNode = gridNode;

    return gridContainer;
}

export function* transitionGrid(type : 'in' | 'out', view: View2D, fill: string, transitionGridOutput: {gridNode: Layout, duration: number}, squaresY: number = 10, colDelay: number = 0.02, squareTime: number = 0.2){
    const grow = type == 'out';

    const scaleBonus = 0.01;
    const gridContainer = createTransitionGrid(view, squaresY, fill, grow ? (0) : (1+scaleBonus));

    const grid = gridContainer.grid;
    transitionGridOutput.gridNode = gridContainer.gridNode;
    transitionGridOutput.duration = colDelay * grid.length + squareTime;

    yield* sequence(colDelay, ...grid.map(col =>
        all(
            ...col.map(rect =>
                tween(squareTime, value => {
                    const val = grow ? (value+scaleBonus) : (1-value);
                    rect.scale(val)
                })
            )
        )
    ));
}
