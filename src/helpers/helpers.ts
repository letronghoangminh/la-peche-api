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
};

export const Messages = {
  NOTIFICATION: {
    NOTI_READ: 'Notification has been changed status to read',
    NOTI_PINNED: 'Notification has been changed status to pinned',
    NOTI_UNREAD: 'Notification has been changed status to unread',
  },
};

export const APISummaries = {
  UNAUTH: 'No token required',
  USER: 'User permission required',
  ADMIN: 'Admin permission required',
};

export function genCouponCode(length = 6): string {
  let coupon = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength: number = characters.length;
  let counter = 0;

  while (counter < length) {
    coupon += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return coupon;
}
