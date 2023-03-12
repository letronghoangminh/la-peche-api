import { plainToInstance } from 'class-transformer';

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
  email: false,
  phoneNumber: false,
};

export const sensitiveFields = [
  'id', 'cluster', 'isActivated', 'isDeleted', 'verifyAt', 'premiumEndsAt',
  'createdAt', 'updatedAt', 'lastOnline', 'role', 
]

export const ErrorMessages = {
  AUTH: {
    USER_INACTIVE: 'This user has been deactivated',
    CREDENTIALS_INCORRECT: 'Credentials incorrect',
  },
  NOTIFICATION: {
    NOTI_NOT_FOUND: 'Notification not found',
  },
  COUPON: {
    COUPON_NOT_FOUND: 'Coupon not found',
  },
  REPORT: {
    REPORT_NOT_FOUND: 'Report not found',
    USERNAME_INVALID:
      "The report can't not be created, please verify the target username and reporter username",
  },
  USER: {
    USER_NOT_FOUND: 'User not found',
    USER_LIKED: 'This user has already been liked',
    USER_INVALID: 'User invalid',
    USER_STARRED: 'This user has already been starred',
    USER_INACTIVE: 'Please activate this user first',
    USER_IMAGE_NOT_EXIST: 'Image not found',
  },
};

export const Messages = {
  NOTIFICATION: {
    NOTI_READ: 'Notification has been changed status to read',
    NOTI_PINNED: 'Notification has been changed status to pinned',
    NOTI_UNREAD: 'Notification has been changed status to unread',
  },
  USER: {
    USER_LIKED: 'This user has been liked',
    USER_STARRED: 'This user has been starred',
  },
};

export const APISummaries = {
  UNAUTH: 'No token required',
  USER: 'User permission required',
  ADMIN: 'Admin permission required',
};

export function genRandomString(length = 6): string {
  let random = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength: number = characters.length;
  let counter = 0;

  while (counter < length) {
    random += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return random;
}

export function PlainToInstance(model: any, response: any): any {
  return plainToInstance(model, response, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
    strategy: 'excludeAll',
  });
}
