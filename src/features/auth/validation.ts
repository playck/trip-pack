export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateUsername = (username: string) => {
  return username.length >= 2;
};

// 로그인 폼 검증 타입
export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// 회원가입 폼 검증 타입
export interface SignupFormErrors {
  email?: string;
  password?: string;
  username?: string;
  general?: string;
}

// 로그인 폼 검증 함수
export const validateLoginForm = (
  email: string,
  password: string
): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!email) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!validateEmail(email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  if (!password) {
    errors.password = "비밀번호를 입력해주세요.";
  }

  return errors;
};

// 회원가입 폼 검증 함수
export const validateSignupForm = (
  email: string,
  password: string,
  username: string
): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  if (!email) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!validateEmail(email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  if (!password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (!validatePassword(password)) {
    errors.password = "비밀번호는 최소 6자리 이상이어야 합니다.";
  }

  if (!username) {
    errors.username = "유저명을 입력해주세요.";
  } else if (!validateUsername(username)) {
    errors.username = "유저명은 최소 2자리 이상이어야 합니다.";
  }

  return errors;
};

// Auth 에러 처리 함수들
export const handleSignupError = (error: {
  message: string;
}): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  if (error.message.includes("already registered")) {
    errors.email = "이미 가입된 이메일입니다.";
  } else if (error.message.includes("Password should be")) {
    errors.password = "비밀번호는 최소 6자리 이상이어야 합니다.";
  } else if (error.message.includes("Invalid email")) {
    errors.email = "올바르지 않은 이메일 형식입니다.";
  } else {
    errors.general = "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";
  }

  return errors;
};

export const handleLoginError = (error: {
  message: string;
}): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (error.message.includes("Invalid login credentials")) {
    errors.general = "이메일 또는 비밀번호가 올바르지 않습니다.";
  } else if (error.message.includes("Email not confirmed")) {
    errors.general = "계정 활성화가 필요합니다. 관리자에게 문의해주세요.";
  } else {
    errors.general = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
  }

  return errors;
};
