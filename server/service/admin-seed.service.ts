import { UserModel } from '../model/user.model.ts';

type AdminSeedConfig = {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_NAME?: string;
};

type UserModelLike = {
  findOne: (filter: { email: string }) => Promise<unknown>;
  create: (user: { email: string; password: string; name: string; role: 'admin' }) => Promise<unknown>;
};

export async function seedAdmin(
  model: UserModelLike = UserModel,
  config: AdminSeedConfig = process.env,
): Promise<void> {
  const email = config.ADMIN_EMAIL?.trim();
  const password = config.ADMIN_PASSWORD;
  const name = config.ADMIN_NAME?.trim();

  if (!email || !password || !name) {
    console.warn('⚠️ Admin seed skipped: ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME are required.');
    return;
  }

  const existingUser = await model.findOne({ email });
  if (existingUser) {
    console.log(`✅ Admin account already exists: ${email}`);
    return;
  }

  await model.create({ email, password, name, role: 'admin' });
  console.log(`✅ Admin account created: ${email}`);
}
