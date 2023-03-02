import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function makeEmail(length: number): string {
  let result: string = '';
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  let counter: number = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result + "@gmail.com";
}

async function main() {
  const hashedPassword: string = "$argon2id$v=19$m=65536,t=3,p=4$WNAxshlttjgKgwkN/CF8WQ$06hKwaFlJp/UmQz1ZXx57ZLRNqFudqHtrJneAhuqDaw";
  const adminNames: string[] = ['psycholog1st', 'chovbeovkieu', 'abiem'];
  const userNames: string[] = ['Natsuya', 'Makima', 'Fubuki', 'Furuhashi', 'Kaito', 'Huy Ph', 'letitthieu', 'A Ca LC'];
  const genders: string[] = ['male', 'female', 'other'];
  const statuses: string[] = ['married', 'single', 'had a girl friend', 'had a boy friend'];
  const orientations: string[] = ['female', 'male', 'other'];
  const biographics: string[] = ['Don\' follow your dream, follow me', 'I love anime', 'Dm thang keo con', 'The may da nghe', 'Biet thi noi, khong biet la a bi em'];
  const yearOfBirthes: number[] = [2002, 2000, 2001];
  const bodyTypes: string[] = ['normal', 'fat', 'thin'];
  const diets: string[] = ['normal', 'on diet'];
  const drinks: string[] = ['coke', 'mango juice', 'coffee'];
  const drugs: string[] = ['none', 'heroin', 'weed'];
  const educations: string[] = ['High school students', 'Uni students', 'Graduated'];
  const ethnicities: string[] = ['King', 'Aryan', 'Saxon'];
  const jobs: string[] = ['DevOps Engineer', 'AI Engineer', 'Software Engineer'];
  const locations: string[] = ['Da Nang', 'Laos', 'Japan', 'Amerika'];
  const offspring: string[] = ['none', '1 kid', '2 kids'];
  const pets: string[] = ['dog', 'cat', 'none'];
  const signs: string[] = ['none', 'very tall', 'super fat'];
  const smokes: string[] = ['none', 'ciagrettes', 'weed'];
  const speaks: string[] = ['Flexing', 'Vietnamese', 'English'];

  const introShownFields = {
    yearOfBirth: true,
    bodyType: true,
    diet: true,
    drinks: true,
    drugs: false,
    education: true,
    ethnicity: true,
    height: true,
    income: false,
    job: true,
    location: false,
    offspring: false,
    pets: false,
    sign: true,
    smokes: false,
    speaks: true,
  }
  adminNames.forEach(async (name) => {
    await prisma.user.create({
      data: {
        hashedPassword: hashedPassword,
        cluster: 0,
        isActivated: true,
        isDeleted: false,
        role: 'ADMIN',
        name: name,
        isVerified: true,
        username: name,
        gender: randomChoice(genders),
        status: randomChoice(statuses),
        orientation: randomChoice(orientations),
        biographic: randomChoice(biographics),
        email: makeEmail(5),
        yearOfBirth: randomChoice(yearOfBirthes),
        bodyType: randomChoice(bodyTypes),
        diet: randomChoice(diets),
        drinks: randomChoice(drinks),
        drugs: randomChoice(drugs),
        education: randomChoice(educations),
        ethnicity: randomChoice(ethnicities),
        height: 150 + getRandomInt(1, 30),
        income: 1000 + getRandomInt(0, 1000),
        job: randomChoice(jobs),
        location: randomChoice(locations),
        offspring: randomChoice(offspring),
        pets: randomChoice(pets),
        sign: randomChoice(signs),
        smokes: randomChoice(smokes),
        speaks: randomChoice(speaks),
        introShownFields: introShownFields,
      }
    });
  });

  userNames.forEach(async (name) => {
    await prisma.user.create({
      data: {
        hashedPassword: hashedPassword,
        cluster: 0,
        isActivated: true,
        isDeleted: false,
        role: 'USER',
        name: name,
        isVerified: true,
        username: name,
        gender: randomChoice(genders),
        status: randomChoice(statuses),
        orientation: randomChoice(orientations),
        biographic: randomChoice(biographics),
        email: makeEmail(5),
        yearOfBirth: randomChoice(yearOfBirthes),
        bodyType: randomChoice(bodyTypes),
        diet: randomChoice(diets),
        drinks: randomChoice(drinks),
        drugs: randomChoice(drugs),
        education: randomChoice(educations),
        ethnicity: randomChoice(ethnicities),
        height: 150 + getRandomInt(1, 30),
        income: 1000 + getRandomInt(0, 1000),
        job: randomChoice(locations),
        location: randomChoice(jobs),
        offspring: randomChoice(offspring),
        pets: randomChoice(pets),
        sign: randomChoice(signs),
        smokes: randomChoice(smokes),
        speaks: randomChoice(speaks),
        introShownFields: introShownFields,
      }
    });
  });

  await new Promise(r => setTimeout(r, 2000));

  await prisma.notification.create({
    data: {
      text: 'Congrats, you are the admin',
      status: 'UNREAD',
      userId: 1,
    }
  });

  await prisma.coupon.create({
    data: {
      code: 'DAKWA',
      discountPercent: 100,
      userId: 1,
    }
  });

  await prisma.report.create({
    data: {
      category: 'Thang mat day',
      reason: 'Thang mat day',
      reporterName: 'psycholog1st',
      targetName: 'chovbeovkieu',
      status: 'PENDING',
    }
  });

  await prisma.user_image.create({
    data: {
      url: "https://cc.com/image123",
      isThumbnail: true,
      userId: 1,
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
