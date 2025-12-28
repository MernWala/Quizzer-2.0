import { body } from "express-validator";

export const validateName = (key) =>
  body(key)
    .trim()
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .isLength({ min: 3 })
    .withMessage(`${key} is too short! Must be at least 3 characters.`);

export const validateRole = (key) =>
  body(key)
    .trim()
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .custom((value) => {
      const validRoles = ["client", "admin", "super_admin"];
      if (validRoles.includes(value)) {
        return true;
      }
      throw new Error(
        `${key} is not valid! Must be one of: ${validRoles.join(", ")}.`
      );
    });

export const validateEmail = (key) =>
  body(key)
    .trim()
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .isEmail()
    .withMessage(`${key} is not valid.`);

export const validatePassword = (key) =>
  body(key)
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .trim()
    .custom((value) => {
      const requirements = [
        {
          regex: /[a-z]/,
          message: "Password must contain at least one lowercase letter.",
        },
        {
          regex: /[A-Z]/,
          message: "Password must contain at least one uppercase letter.",
        },
        {
          regex: /[0-9]/,
          message: "Password must contain at least one number.",
        },
        {
          regex: /[\W_]/,
          message: "Password must contain at least one special character.",
        },
      ];
      for (const requirement of requirements) {
        if (!requirement.regex.test(value)) {
          throw new Error(requirement.message);
        }
      }
      return true;
    });

export const validateMongoId = (key) =>
  body(key)
    .exists()
    .withMessage(`${key} ID not found`)
    .bail()
    .isMongoId()
    .withMessage(`${key} is not a valid MongoID.`);

export const validateBoolean = (key) =>
  body(key)
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .isBoolean()
    .withMessage(`${key} is not a valid boolean type!`);

export const validateOptionalBoolean = (key) =>
  body(key)
    .optional()
    .isBoolean()
    .withMessage(`${key} is not a valid boolean type!`);

export const validateLongString = (key) =>
  body(key)
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .isString()
    .withMessage(`${key} is too short`)
    .bail()
    .isLength({ min: 25 })
    .withMessage(`${key} should atleast 25 character long!`);

export const validateStringArray = (key) =>
  body(key)
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .isArray()
    .withMessage(`${key} must be an array`)
    .bail()
    .custom((array) => array.every((item) => typeof item === "string"))
    .withMessage(`Each ${key} must be a string`)
    .bail()
    .custom((array) => array.every((item) => item.trim().length > 0))
    .withMessage(`${key} cannot be empty [Strings]`);

export const validateNumber = (key) =>
  body(key)
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .isNumeric()
    .withMessage("Not a valid number");
