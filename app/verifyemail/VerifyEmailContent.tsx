"use client";

/**
 * ============================================================================
 * VERIFY EMAIL PAGE
 * ============================================================================
 */

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    useRouter,
    useSearchParams
} from "next/navigation";

import {
    useAuth
} from "../../hooks/useAuth";

import {
    ROUTES
} from "../../router";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function VerifyEmailContent() {

    const router =
        useRouter();

    const searchParams =
        useSearchParams();

    const token =
        searchParams?.get("token") ?? "";

    const {

        verifyEmail,

        loading,

        error,

        clearError

    } = useAuth();

    const [

        success,

        setSuccess

    ] = useState(false);

    const [

        verificationError,

        setVerificationError

    ] = useState<string | null>(null);

    const redirectTimer =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ---------------------------------------------------------------------- */
    /* VERIFY EMAIL                                                           */
    /* ---------------------------------------------------------------------- */

    const verify =
        useCallback(

            async () => {

                clearError();

                setVerificationError(null);

                if (!token) {

                    setVerificationError(

                        "Verification token is missing."

                    );

                    return;

                }

                try {

                    await verifyEmail(token);

                    setSuccess(true);

                    redirectTimer.current =
                        setTimeout(

                            () => {

                                router.replace(

                                    ROUTES.LOGIN

                                );

                            },

                            3000

                        );

                }

                catch (

                    exception

                ) {

                    const err =
                        exception instanceof Error
                            ? exception.message
                            : "Email verification failed.";

                    setVerificationError(err);

                }

            },

            [

                token,

                verifyEmail,

                router,

                clearError

            ]

        );

    /* ---------------------------------------------------------------------- */
    /* EFFECT                                                                 */
    /* ---------------------------------------------------------------------- */

    useEffect(

        () => {

            verify();

        },

        [

            verify

        ]

    );

    useEffect(

        () => {

            return () => {

                clearError();

                if (

                    redirectTimer.current

                ) {

                    clearTimeout(

                        redirectTimer.current

                    );

                }

            };

        },

        [

            clearError

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return (

        <main

            className="verify-email-page"

        >

            <div

                className="verify-email-card"

            >

                <h1>

                    Verify Email

                </h1>

                {

                    loading && (

                        <div

                            className="verify-email-loading"

                        >

                            Verifying your email address...

                        </div>

                    )

                }

                {

                    success && (

                        <div

                            className="verify-email-success"

                        >

                            <h2>

                                Email Verified Successfully

                            </h2>

                            <p>

                                Your email address has been verified.

                            </p>

                            <p>

                                Redirecting you to the login page...

                            </p>

                        </div>

                    )

                }

                {

                    (

                        verificationError ||

                        error

                    ) && (

                        <div

                            className="verify-email-error"

                        >

                            <h2>

                                Verification Failed

                            </h2>

                            <p>

                                {

                                    verificationError ??

                                    error?.message

                                }

                            </p>

                        </div>

                    )

                }

                <div

                    className="verify-email-actions"

                >

                    <button

                        type="button"

                        onClick={

                            () =>

                                router.push(

                                    ROUTES.LOGIN

                                )

                        }

                    >

                        Go to Login

                    </button>

                </div>

            </div>

        </main>

    );

}