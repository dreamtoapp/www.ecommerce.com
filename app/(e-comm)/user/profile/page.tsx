import { redirect } from 'next/navigation';

import EmptyState from '../../../../components/warinig-msg';
import getSession from '../../../../lib/getSession';
import { userProfile } from './action/action';
import UserProfileForm from './component/update-profile';

async function ProfilePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const userId = resolvedSearchParams.id;

  // const session = await auth();
  const session = await getSession();
  const user = session?.user;
  if (!user) return redirect('/auth/login');

  if (!userId) return <EmptyState message='معرّف المستخدم غير صالح' />;

  const userData = await userProfile(userId);
  if (!userData) return <EmptyState message='المستخدم غير موجود' />;

  return <UserProfileForm userData={{
    id: userData.id ?? '',
    image: userData.image ?? '',
    name: userData.name ?? '',
    email: userData.email ?? '',
    phone: userData.phone ?? '',
    address: userData.address ?? '',
    password: userData.password ?? '',
    latitude: userData.latitude?.toString(),
    longitude: userData.longitude?.toString(),
  }} />;
}

export default ProfilePage;
