"use client";
import Link from "next/link";

/**
 * ============================================================================
 * LOGIN PAGE
 * ============================================================================
 */

import {
    FormEvent,
    KeyboardEvent,
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

import {
    ROUTES
} from "../../router";

export default function LoginPage() {

    const router = useRouter();

    const {

        login,

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

        password,

        setPassword

    ] = useState("");

    const [

        remember,

        setRemember

    ] = useState(false);

    const [

        showPassword,

        setShowPassword

    ] = useState(false);

    const [

        validationError,

        setValidationError

    ] = useState<string | null>(null);

    const emailId =

        "login-email";

    const passwordId =

        "login-password";

    /* ---------------------------------------------------------------------- */
    /* VALIDATION                                                             */
    /* ---------------------------------------------------------------------- */

    const validate = useCallback(

        () => {

            if (

                email.trim().length === 0

            ) {

                setValidationError(

                    "Email is required."

                );

                return false;

            }

            if (password.length < 6) {

    setValidationError(

        "Password must contain at least 6 characters."

    );

    return false;

}

            const emailPattern =

                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (

                !emailPattern.test(email)

            ) {

                setValidationError(

                    "Please enter a valid email address."

                );

                return false;

            }

            setValidationError(null);

            return true;

        },

        [

            email,

            password

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* FORM STATE                                                             */
    /* ---------------------------------------------------------------------- */

    const canSubmit = useMemo(

        () =>

            email.trim().length > 0 &&

            password.length > 0 &&

            !loading,

        [

            email,

            password,

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

                await login({

                    email,

                    password,

                    remember

                });

                router.replace(

                    ROUTES.DASHBOARD

                );

            }

            catch (err) {

    console.error(err);

    setValidationError(
        "Incorrect email or password."
    );

}

        },

        [

            email,

            password,

            remember,

            login,

            validate,

            clearError,

            router

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* ENTER KEY                                                              */
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
    /* REDIRECT                                                               */
    /* ---------------------------------------------------------------------- */

    useEffect(

        () => {

            if (

                isLoggedIn

            ) {

                router.replace(

                    ROUTES.DASHBOARD

                );

            }

        },

        [

            isLoggedIn,

            router

        ]

    );

    /* ---------------------------------------------------------------------- */
    /* CLEANUP                                                                */
    /* ---------------------------------------------------------------------- */

    useEffect(

        () => {

            return () => {

                clearError();

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

<div className="login-page">

    <div className="login-card">

        <div className="login-header">

            <h1>Welcome Back</h1>

            <p>
                Sign in to continue trading.
            </p>

        </div>

        {(validationError || error) && (

            <div className="login-error">

                {
                    validationError ??
                    "Incorrect email or password."
                }

            </div>

        )}

        <form

            className="login-form"

            onSubmit={handleSubmit}

            onKeyDown={handleKeyDown}

        >

            <div className="form-group">

                <label htmlFor={emailId}>

                    Email Address

                </label>

                <input

                    id={emailId}

                    type="email"

                    placeholder="Enter your email"

                    autoComplete="email"

                    value={email}

                    onChange={(event) =>
                        setEmail(event.target.value)
                    }

                />

            </div>

            <div className="form-group">

                <label htmlFor={passwordId}>

                    Password

                </label>

                <input

                    id={passwordId}

                    type={showPassword ? "text" : "password"}

                    placeholder="Enter your password"

                    autoComplete="current-password"

                    value={password}

                    onChange={(event) =>
                        setPassword(event.target.value)
                    }

                />

            </div>

            <div className="login-options">

                <label className="checkbox">

                    <input

                        type="checkbox"

                        checked={remember}

                        onChange={(event) =>
                            setRemember(event.target.checked)
                        }

                    />

                    Remember Me

                </label>

                <label className="checkbox">

                    <input

                        type="checkbox"

                        checked={showPassword}

                        onChange={(event) =>
                            setShowPassword(event.target.checked)
                        }

                    />

                    Show Password

                </label>

            </div>

            <button

                className="login-button"

                type="submit"

                disabled={!canSubmit}

            >

                {

                    loading

                        ? "Signing In..."

                        : "Login"

                }

            </button>

            <br />
            <br />  

            <div className="login-links">

            <Link href={ROUTES.FORGOT_PASSWORD}>

                Forgot Password?

            </Link>

        </div>
        <br />
        <div className="register-section">

            <span>

                Don't have an account?

            </span>

            <Link href={ROUTES.REGISTER}>

                Create Account

            </Link>

        </div>
        <div className="login-footer">

            Secure authentication protected with encrypted communication.

        </div>

        </form>

        

        

        

    </div>

</div>

);

}