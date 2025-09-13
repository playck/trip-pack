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
