export interface ChartCoordinate {

    time: number;

    x: number;

}

class CoordinateRegistry {

    private coordinates = new Map<number, number>();

    private candleWidth = 8;

    private startX = 80;

    setLayout(

        candleWidth: number,

        startX: number

    ) {

        this.candleWidth = candleWidth;

        this.startX = startX;

    }

    rebuild(times: number[]) {

        this.coordinates.clear();

        times.forEach((time, index) => {

            this.coordinates.set(

                time,

                this.startX +

                    index * this.candleWidth

            );

        });

    }

    getX(time: number) {

        return this.coordinates.get(time);

    }

    clear() {

        this.coordinates.clear();

    }

}

export const chartCoordinates =
    new CoordinateRegistry();