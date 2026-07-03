"use client";

/**
 * ============================================================================
 * REGISTER PAGE
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

import { useRouter } from "next/navigation";

import { useAuth } from "../../hooks/useAuth";

import { ROUTES } from "../../router";

export default function RegisterPage() {

    const router = useRouter();

    const {
        register,
        loading,
        error,
        clearError,
        isLoggedIn
    } = useAuth();

    /* ---------------------------------------------------------------------- */
    /* FORM STATE                                                             */
    /* ---------------------------------------------------------------------- */

    const [fullName, setFullName] = useState("");

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [acceptTerms, setAcceptTerms] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] = useState(false);

    const [
        validationError,
        setValidationError
    ] = useState<string | null>(null);

    /* ---------------------------------------------------------------------- */
    /* ACCESSIBILITY IDS                                                      */
    /* ---------------------------------------------------------------------- */

    const fullNameId = "register-full-name";

    const usernameId = "register-username";

    const emailId = "register-email";

    const passwordId = "register-password";

    const confirmPasswordId =
        "register-confirm-password";

    /* ---------------------------------------------------------------------- */
    /* PASSWORD STRENGTH                                                      */
    /* ---------------------------------------------------------------------- */

    const passwordStrength = useMemo(() => {

        if (password.length < 8) {

            return "Weak";

        }

        let score = 0;

        if (/[A-Z]/.test(password)) {

            score++;

        }

        if (/[a-z]/.test(password)) {

            score++;

        }

        if (/\d/.test(password)) {

            score++;

        }

        if (/[^A-Za-z0-9]/.test(password)) {

            score++;

        }

        if (score <= 2) {

            return "Medium";

        }

        return "Strong";

    }, [password]);

    /* ---------------------------------------------------------------------- */
    /* VALIDATION                                                             */
    /* ---------------------------------------------------------------------- */

    const validate = useCallback(() => {

        if (!fullName.trim()) {

            setValidationError(
                "Full name is required."
            );

            return false;

        }

        if (username.trim().length < 3) {

            setValidationError(
                "Username must contain at least 3 characters."
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

        if (password.length < 8) {

            setValidationError(
                "Password must contain at least 8 characters."
            );

            return false;

        }

        if (password !== confirmPassword) {

            setValidationError(
                "Passwords do not match."
            );

            return false;

        }

        if (!acceptTerms) {

            setValidationError(
                "You must accept the Terms of Service and Privacy Policy."
            );

            return false;

        }

        setValidationError(null);

        return true;

    }, [

        fullName,
        username,
        email,
        password,
        confirmPassword,
        acceptTerms

    ]);

    /* ---------------------------------------------------------------------- */
    /* FORM STATE                                                             */
    /* ---------------------------------------------------------------------- */

    const canSubmit = useMemo(() => {

        return (
            fullName.trim().length > 0 &&
            username.trim().length > 0 &&
            email.trim().length > 0 &&
            password.length > 0 &&
            confirmPassword.length > 0 &&
            acceptTerms &&
            !loading
        );

    }, [

        fullName,
        username,
        email,
        password,
        confirmPassword,
        acceptTerms,
        loading

    ]);

    /* ---------------------------------------------------------------------- */
    /* SUBMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = useCallback(

        async (
            event: FormEvent<HTMLFormElement>
        ) => {

            event.preventDefault();

            clearError();

            if (!validate()) {

                return;

            }

            const names =
                fullName.trim().split(/\s+/);

            const firstName =
                names.shift() ?? "";

            const lastName =
                names.join(" ");

            try {

                await register({
    username,
    email,
    password,
    firstName,
    lastName
});

// Registration successful.
// Redirect user to the login page.
router.replace(ROUTES.LOGIN);

            }

            catch {

                // handled by useAuth

            }

        },

        [

            fullName,
            username,
            email,
            password,
            confirmPassword,
            acceptTerms,
            register,
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

        [canSubmit]

    );

    /* ---------------------------------------------------------------------- */
    /* EFFECTS                                                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (isLoggedIn) {

            router.replace(
                ROUTES.DASHBOARD
            );

        }

    }, [

        isLoggedIn,
        router

    ]);

    useEffect(() => {

        return () => {

            clearError();

        };

    }, [

        clearError

    ]);

    /* ---------------------------------------------------------------------- */
    /* PART 2 STARTS WITH THE RETURN STATEMENT                                */
    /* ---------------------------------------------------------------------- */

        return (

<div className="register-page">

    <div className="register-card">

        <div className="register-logo">
            <h2>logo</h2>
        </div>

        <div className="register-header">

            <h1>Create Your Account</h1>

            <p>
                Start trading in minutes with a secure account.
            </p>

        </div>

        {(validationError || error) && (

            <div className="register-error">

                {validationError ?? error?.message}

            </div>

        )}

        <form

            className="register-form"

            onSubmit={handleSubmit}

            onKeyDown={handleKeyDown}

            noValidate

        >

            <div className="form-group">

                <label htmlFor={fullNameId}>
                    Full Name
                </label>

                <input

                    id={fullNameId}

                    type="text"

                    placeholder="Peter Mutiso"

                    autoComplete="name"

                    value={fullName}

                    onChange={(event)=>

                        setFullName(event.target.value)

                    }

                />

            </div>

            <div className="form-group">

                <label htmlFor={usernameId}>
                    Username
                </label>

                <input

                    id={usernameId}

                    type="text"

                    placeholder="petermutiso"

                    autoComplete="username"

                    value={username}

                    onChange={(event)=>

                        setUsername(event.target.value)

                    }

                />

            </div>

            <div className="form-group">

                <label htmlFor={emailId}>
                    Email Address
                </label>

                <input

                    id={emailId}

                    type="email"

                    placeholder="peter@example.com"

                    autoComplete="email"

                    value={email}

                    onChange={(event)=>

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

                    placeholder="Create a password"

                    autoComplete="new-password"

                    value={password}

                    onChange={(event)=>

                        setPassword(event.target.value)

                    }

                />

            </div>

            <div className="password-strength">

                <span>Password Strength</span>

                <div className="strength-bar">

                    <div
                        className={`strength-fill ${passwordStrength.toLowerCase()}`}
                    />

                </div>

                <small>

                    {passwordStrength}

                </small>

            </div>

            <div className="form-group">

                <label htmlFor={confirmPasswordId}>
                    Confirm Password
                </label>

                <input

                    id={confirmPasswordId}

                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }

                    placeholder="Confirm password"

                    autoComplete="new-password"

                    value={confirmPassword}

                    onChange={(event)=>

                        setConfirmPassword(
                            event.target.value
                        )

                    }

                />

            </div>

            <div className="checkbox-row">

    <label className="checkbox-item">

        <input
            type="checkbox"
            checked={showPassword}
            onChange={(event)=>
                setShowPassword(event.target.checked)
            }
        />

        <span>Show Password</span>

    </label>

    <label className="checkbox-item">

        <input
            type="checkbox"
            checked={showConfirmPassword}
            onChange={(event)=>
                setShowConfirmPassword(event.target.checked)
            }
        />

        <span>Show Confirm Password</span>

    </label>

</div>

<label className="terms">

    <input
        type="checkbox"
        checked={acceptTerms}
        onChange={(event)=>
            setAcceptTerms(event.target.checked)
        }
    />

    <span>
        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
    </span>

</label>
            <button

                className="register-button"

                type="submit"

                disabled={!canSubmit}

            >

                {

                    loading

                        ? "Creating Account..."

                        : "Create Account"

                }

            </button>

        </form>

        <div className="divider">

            <span>
                OR
            </span>

        </div>

        <button

            type="button"

            className="login-link"

            onClick={()=>

                router.push(
                    ROUTES.LOGIN
                )

            }

        >

            Already have an account? Sign In

        </button>

        <div className="register-footer">

            <p>

                Your personal information is protected using industry-standard encryption.

            </p>

        </div>

    </div>

</div>

);
}