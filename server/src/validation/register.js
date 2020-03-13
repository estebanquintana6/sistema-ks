const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Se requiere un nombre.";
  }

  if (Validator.isEmpty(data.last_name)) {
    errors.last_name = "Se require el campo de apellido.";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email es requerido.";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "El email no es valido.";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "El campo de contraseña es requerido.";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirma tu contraseña";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Las contraseñas deben coincidir";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};