import {
    ContractType
} from "@/components/trading/types";


interface Props {

    value: ContractType;

    onChange(
        value: ContractType
    ): void;

}


const CONTRACTS: ContractType[] = [

    ContractType.RISE,

    ContractType.FALL,

    ContractType.HIGHER,

    ContractType.LOWER,

    ContractType.TOUCH,

    ContractType.NO_TOUCH,

    ContractType.DIGIT_OVER,

    ContractType.DIGIT_UNDER,

];


export default function ContractSelector({

    value,

    onChange

}: Props) {


    return (

        <select

            value={value}

            onChange={(event) =>

                onChange(

                    event.target.value as ContractType

                )

            }

            className="
                w-full
                rounded-lg
                border
                border-slate-700
                bg-slate-900
                px-3
                py-2
                text-sm
                text-white
                outline-none
                focus:border-blue-500
            "

        >

            {

                CONTRACTS.map(

                    contract => (

                        <option

                            key={contract}

                            value={contract}

                        >

                            {contract.replace("_", " ")}

                        </option>

                    )

                )

            }

        </select>

    );

}