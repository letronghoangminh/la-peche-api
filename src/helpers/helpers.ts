export const introShownFields = {
  yearOfBirth: false,
  bodyType: false,
  diet: false,
  drinks: false,
  drugs: false,
  education: false,
  ethnicity: false,
  height: false,
  income: false,
  job: false,
  location: false,
  offspring: false,
  pets: false,
  sign: false,
  smokes: false,
  speaks: false,
};

export const ErrorMessages = {
  AUTH: {
    USER_INACTIVE: 'This user has been deactivated',
    CREDENTIALS_INCORRECT: 'Credentials incorrect',
  },
};

export const APISummaries = {
  'UNAUTH': 'No token required',
  'USER': 'User permission required',
  'ADMIN': 'Admin permission required',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}