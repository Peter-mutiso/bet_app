interface Props {

    value: number;

    onChange(value: number): void;

}

const DURATIONS = [

    1,

    2,

    3,

    5,

    10,

    15,

    30,

    60

];

export default function DurationSelector({

    value,

    onChange

}: Props) {

    return (

        <div className="duration-selector">

            <label>

                Duration

            </label>

            <select

                value={value}

                onChange={

                    event =>

                        onChange(

                            Number(

                                event.target.value

                            )

                        )

                }

            >

                {

                    DURATIONS.map(

                        duration => (

                            <option

                                key={duration}

                                value={duration}

                            >

                                {duration} Minutes

                            </option>

                        )

                    )

                }

            </select>

        </div>

    );

}