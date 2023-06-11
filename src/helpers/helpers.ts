import { plainToInstance } from 'class-transformer';

export const introShownFields = {
  yearOfBirth: true,
  bodyType: true,
  diet: true,
  drinks: true,
  drugs: true,
  education: true,
  ethnicity: true,
  height: true,
  income: true,
  job: true,
  location: true,
  offspring: true,
  pets: true,
  sign: true,
  smokes: true,
  speaks: true,
  email: true,
  phoneNumber: true,
};

export const sensitiveFields = [
  'cluster',
  'isActivated',
  'isDeleted',
  'verifyAt',
  'premiumEndsAt',
  'createdAt',
  'updatedAt',
  'lastOnline',
  'role',
];

export const ErrorMessages = {
  AUTH: {
    USER_INACTIVE: 'This user has been deactivated',
    CREDENTIALS_INCORRECT: 'Credentials incorrect',
    INVALID_TOKEN: 'Invalid token',
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
    USER_NOT_LIKED: 'This user has not been liked',
    USER_INVALID: 'User invalid',
    USER_STARRED: 'This user has already been starred',
    USER_NOT_STARRED: 'This user has not been starred',
    USER_SKIPPED: 'This user has already been skipped',
    USER_NOT_SKIPPED: 'This user has not been skipped',
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
    USER_UNLIKED: 'This user has been unliked',
    USER_STARRED: 'This user has been starred',
    USER_UNSTARRED: 'This user has been unstarred',
    USER_SKIPPED: 'This user has been skipped',
    USER_UNSKIPPED: 'This user has been unskipped',
    USER_BANNED: 'This user has been banned',
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
