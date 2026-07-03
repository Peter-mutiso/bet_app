interface Props {

    disabled: boolean;

    loading: boolean;

    payout: number;

    onBuy(): void;

}

export default function BuySellPanel({

    disabled,

    loading,

    payout,

    onBuy

}: Props) {

    return (

        <div className="buy-sell-panel">

            <div className="expected-payout">

                <small>

                    Estimated Payout

                </small>

                <h2>

                    {payout.toFixed(2)}

                </h2>

            </div>

            <button

                disabled={

                    disabled ||

                    loading

                }

                onClick={onBuy}

            >

                {

                    loading

                        ? "Processing..."

                        : "Place Trade"

                }

            </button>

        </div>

    );

}