"use client";

/**
 * ============================================================================
 * RESET PASSWORD PAGE
 * ============================================================================
 */

import {
    FormEvent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
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

export default function ResetPasswordPage() {

    const router =
        useRouter();

    const searchParams =
        useSearchParams();

    const token =
    searchParams?.get("token") ?? "";

    const {

        resetPassword,

        loading,

        error,

        clearError

    } = useAuth();

    const [

        password,

        setPassword

    ] = useState("");

    const [

        confirmPassword,

        setConfirmPassword

    ] = useState("");

    const [

        showPassword,

        setShowPassword

    ] = useState(false);

    const [

        showConfirmPassword,

        setShowConfirmPassword

    ] = useState(false);

    const [

        success,

        setSuccess

    ] = useState(false);

    const [

        validationError,

        setValidationError

    ] = useState<string | null>(null);

    const redirectTimer =
        useRef<NodeJS.Timeout | null>(null);

    /* ---------------------------------------------------------------------- */
    /* ACCESSIBILITY IDS                                                      */
    /* ---------------------------------------------------------------------- */

    const passwordId =
        "reset-password";

    const confirmPasswordId =
        "reset-confirm-password";

    /* ---------------------------------------------------------------------- */
    /* PASSWORD STRENGTH                                                      */
    /* ---------------------------------------------------------------------- */

    const passwordStrength = useMemo(

        () => {

            if (

                password.length < 8

            ) {

                return "Weak";

            }

            const hasUpper =
                /[A-Z]/.test(password);

            const hasLower =
                /[a-z]/.test(password);

            const hasNumber =
                /\d/.test(password);

            const hasSymbol =
                /[^A-Za-z0-9]/.test(password);

            const score =

                [

                    hasUpper,

                    hasLower,

                    hasNumber,

                    hasSymbol

                ].filter(Boolean).length;

            if (

                score <= 2

            ) {

                return "Medium";

            }

            return "Strong";

        },

        [

            password

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* VALIDATION                                                             */
    /* ---------------------------------------------------------------------- */

    const validate = useCallback(

        () => {

            if (

                token.length === 0

            ) {

                setValidationError(

                    "Password reset token is missing."

                );

                return false;

            }

            if (

                password.length < 8

            ) {

                setValidationError(

                    "Password must contain at least 8 characters."

                );

                return false;

            }

            if (

                password !== confirmPassword

            ) {

                setValidationError(

                    "Passwords do not match."

                );

                return false;

            }

            setValidationError(null);

            return true;

        },

        [

            token,

            password,

            confirmPassword

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* FORM STATE                                                             */
    /* ---------------------------------------------------------------------- */

    const canSubmit = useMemo(

        () =>

            password.length > 0 &&

            confirmPassword.length > 0 &&

            token.length > 0 &&

            !loading,

        [

            password,

            confirmPassword,

            token,

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

            if (

                !validate()

            ) {

                return;

            }

            try {

                await resetPassword(

                    token,

                    password

                );

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

            catch {

                // handled by hook

            }

        },

        [

            token,

            password,

            resetPassword,

            validate,

            clearError,

            router

        ]

    );
        /* ---------------------------------------------------------------------- */
    /* KEYBOARD                                                               */
    /* ---------------------------------------------------------------------- */

    const handleKeyDown = useCallback(

        (

            event: KeyboardEvent<HTMLFormElement>

        ) => {

            if (

                event.key === "Enter" &&

                !canSubmit

            ) {

                event.preventDefault();

            }

        },

        [

            canSubmit

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* CLEANUP                                                                */
    /* ---------------------------------------------------------------------- */

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

        <div

            className="reset-password-page"

        >

            <form

                className="reset-password-form"

                onSubmit={handleSubmit}

                onKeyDown={handleKeyDown}

            >

                <h1>

                    Reset Password

                </h1>

                {

                    success && (

                        <div

                            className="success-message"

                        >

                            Password updated successfully.

                            Redirecting to login...

                        </div>

                    )

                }

                {

                    (

                        validationError ||

                        error

                    ) && (

                        <div

                            className="error-message"

                        >

                            {

                                validationError ??

                                error?.message

                            }

                        </div>

                    )

                }

                <input

                    id={passwordId}

                    type={

                        showPassword

                            ? "text"

                            : "password"

                    }

                    placeholder="New Password"

                    autoComplete="new-password"

                    value={password}

                    onChange={

                        event =>

                            setPassword(

                                event.target.value

                            )

                    }

                />

                <label>

                    <input

                        type="checkbox"

                        checked={

                            showPassword

                        }

                        onChange={

                            event =>

                                setShowPassword(

                                    event.target.checked

                                )

                        }

                    />

                    Show Password

                </label>

                <div

                    className="password-strength"

                >

                    Password Strength:

                    <strong>

                        {" "}

                        {passwordStrength}

                    </strong>

                </div>

                <input

                    id={confirmPasswordId}

                    type={

                        showConfirmPassword

                            ? "text"

                            : "password"

                    }

                    placeholder="Confirm Password"

                    autoComplete="new-password"

                    value={confirmPassword}

                    onChange={

                        event =>

                            setConfirmPassword(

                                event.target.value

                            )

                    }

                />

                <label>

                    <input

                        type="checkbox"

                        checked={

                            showConfirmPassword

                        }

                        onChange={

                            event =>

                                setShowConfirmPassword(

                                    event.target.checked

                                )

                        }

                    />

                    Show Confirm Password

                </label>

                <button

                    type="submit"

                    disabled={

                        !canSubmit

                    }

                >

                    {

                        loading

                            ? "Resetting..."

                            : "Reset Password"

                    }

                </button>

                <button

                    type="button"

                    onClick={

                        () =>

                            router.push(

                                ROUTES.LOGIN

                            )

                    }

                >

                    Back to Login

                </button>

            </form>

            <hr />

            <div

                className="reset-password-footer"

            >

                <p>

                    Choose a strong password that you have not used before.

                </p>

            </div>

        </div>

    );

}