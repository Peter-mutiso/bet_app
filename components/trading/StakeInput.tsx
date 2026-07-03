interface Props {

    value: number;

    onChange(

        value: number

    ): void;

}

export default function StakeInput({

    value,

    onChange

}: Props) {

    return (

        <div>

            <label>

                Stake

            </label>

            <input

                type="number"

                min={1}

                value={value}

                onChange={

                    event =>

                        onChange(

                            Number(

                                event.target.value

                            )

                        )

                }

            />

        </div>

    );

}