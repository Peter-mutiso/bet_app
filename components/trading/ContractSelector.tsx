import {

    ContractType

} from "../../types";

interface Props {

    value: ContractType;

    onChange(

        value: ContractType

    ): void;

}

const CONTRACTS: ContractType[] = [

    "RISE",

    "FALL",

    "HIGHER",

    "LOWER",

    "TOUCH",

    "NO_TOUCH",

    "DIGIT_OVER",

    "DIGIT_UNDER"

];

export default function ContractSelector({

    value,

    onChange

}: Props) {

    return (

        <select

            value={value}

            onChange={

                event =>

                    onChange(

                        event.target.value as ContractType

                    )

            }

        >

            {

                CONTRACTS.map(

                    contract => (

                        <option

                            key={contract}

                            value={contract}

                        >

                            {contract}

                        </option>

                    )

                )

            }

        </select>

    );

}