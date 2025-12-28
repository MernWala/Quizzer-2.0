import express from 'express'
import ExpressValidator from '../../middleware/ExpressValidator.js'
import { validateJWT } from '../../validation/queryValidation.js'
import { validateEmail, validateName, validatePassword, validateRole } from '../../validation/bodyValidation.js'
import { ManualLogin, ManualRegister, ManualVerifyAccount, PasswordReset_Send, PasswordReset_Reset, DeactivateAccount, logout } from '../../controllers/auth.js'
import { AdminAuthorityCheck } from '../../validation/authorityCheck.js'

const router = express.Router();

// Route 1: Manually register user
router.post("/register",
    [validateName("name"), validateRole("role"), validateEmail("email"), validatePassword("pass")],
    ExpressValidator, ManualRegister
);

// Route 2: Manually verify accoount
router.get("/verify",
    [validateJWT("token")],
    ExpressValidator, ManualVerifyAccount
);

// Route 3: Manually login user
router.post("/signin",
    [validateEmail("email"), validatePassword("pass")],
    ExpressValidator, ManualLogin
);

// Route 4: Send recovery token via email
router.post("/password-reset/send",
    [validateEmail("email")],
    ExpressValidator, PasswordReset_Send
);

// Route 5: Verify recovery-token of email for Reset Password
router.post("/password-reset/reset",
    [validateJWT("token"), validatePassword("pass")],
    ExpressValidator, PasswordReset_Reset
);

// Route 6: Account deactivate
router.post("/deactivate-account",
    [validatePassword("pass")],
    AdminAuthorityCheck, ExpressValidator, DeactivateAccount
);

// Route 7: Logout user
router.post("/logout", logout)

export default router;
