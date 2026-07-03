"use client";

/**
 * ============================================================================
 * FORGOT PASSWORD PAGE
 * ============================================================================
 */

import {
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";

import {
    useAuth
} from "../../hooks/useAuth";

export default function ForgotPasswordPage() {

    const router = useRouter();

    const {

        forgotPassword,

        loading,

        error,

        clearError,

        isLoggedIn

    } = useAuth();

    const [

        email,

        setEmail

    ] = useState("");

    const [

        success,

        setSuccess

    ] = useState(false);

    const [

        validationError,

        setValidationError

    ] = useState<string | null>(null);

    /* ---------------------------------------------------------------------- */
    /* REDIRECT                                                               */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (isLoggedIn) {

            router.replace("/dashboard");

        }

    }, [

        isLoggedIn,

        router

    ]);

    /* ---------------------------------------------------------------------- */
    /* CLEANUP                                                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        return () => {

            clearError();

        };

    }, [

        clearError

    ]);

    /* ---------------------------------------------------------------------- */
    /* VALIDATION                                                             */
    /* ---------------------------------------------------------------------- */

    const validate = useCallback(() => {

        if (email.trim().length === 0) {

            setValidationError(

                "Email is required."

            );

            return false;

        }

        const emailPattern =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            setValidationError(

                "Please enter a valid email address."

            );

            return false;

        }

        setValidationError(null);

        return true;

    }, [

        email

    ]);

    /* ---------------------------------------------------------------------- */
    /* FORM STATE                                                             */
    /* ---------------------------------------------------------------------- */

    const canSubmit = useMemo(

        () =>

            email.trim().length > 0 &&

            !loading,

        [

            email,

            loading

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* SUBMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = useCallback(

        async (

            event: FormEvent<HTMLFormElement>

        ) => {

            event.preventDefault();

            clearError();

            setSuccess(false);

            if (!validate()) {

                return;

            }

            try {

                await forgotPassword(

                    email.trim()

                );

                setSuccess(true);

            }

            catch {

                // handled by hook

            }

        },

        [

            email,

            forgotPassword,

            validate,

            clearError

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return (

        <main className="forgot-password-page">

            <h1>

                Forgot Password

            </h1>

            {

                success && (

                    <div className="success-message">

                        Password reset instructions have been sent to your email.

                    </div>

                )

            }

            {

                validationError && (

                    <div className="error-message">

                        {validationError}

                    </div>

                )

            }

            {

                error && (

                    <div className="error-message">

                        {error.message}

                    </div>

                )

            }

            <form

                onSubmit={handleSubmit}

            >

                <input

                    type="email"

                    placeholder="Email address"

                    value={email}

                    onChange={

                        event =>

                            setEmail(

                                event.target.value

                            )

                    }

                    required

                />

                <button

                    type="submit"

                    disabled={!canSubmit}

                >

                    {

                        loading

                            ? "Sending..."

                            : "Send Reset Link"

                    }

                </button>

            </form>

            <button

                type="button"

                onClick={

                    () =>

                        router.push("/login")

                }

            >

                Back to Login

            </button>

        </main>

    );

}