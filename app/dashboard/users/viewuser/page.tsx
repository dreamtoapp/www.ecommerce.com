import { format } from 'date-fns';
import db from '@/lib/prisma';
import { PageProps } from '@/types/commonTypes';

type Order = {
  id: string;
  status: string;
  amount: number;
  createdAt: Date;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
};

type UserWithOrders = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  customerOrders: Order[];
};

export default async function ViewUserPage({ params }: PageProps<{ id: string }>) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  if (!id) {
    return <div>User not found</div>;
  }
  const user = await db.user.findUnique({
    where: { id: id },
    include: {
      customerOrders: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const typedUser = user as UserWithOrders;

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <h1 className='mb-10 text-center text-3xl font-extrabold text-green-600'>
        تفاصيل وحركة المستخدم
      </h1>
      <div className='mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg'>
        <div className='mb-8'>
          <p className='mb-4 text-lg'>
            <strong className='text-gray-700'>الاسم:</strong>{' '}
            <span className='text-gray-900'>{typedUser.name}</span>
          </p>
          <p className='mb-4 text-lg'>
            <strong className='text-gray-700'>البريد الإلكتروني:</strong>{' '}
            <span className='text-gray-900'>{typedUser.email}</span>
          </p>
          <p className='mb-4 text-lg'>
            <strong className='text-gray-700'>الهاتف:</strong>{' '}
            <span className='text-gray-900'>{typedUser.phone}</span>
          </p>
          <p className='mb-4 text-lg'>
            <strong className='text-gray-700'>العنوان:</strong>{' '}
            <span className='text-gray-900'>{typedUser.address}</span>
          </p>
        </div>
        <h2 className='mt-10 border-b-2 border-blue-600 pb-2 text-xl font-semibold text-blue-600'>
          الطلبات
        </h2>
        <div>
          <strong>عدد الطلبات:</strong> {typedUser.customerOrders.length}
        </div>
        {typedUser.customerOrders.length > 0 ? (
          <div>
            <h3>الطلبات السابقة</h3>
            {typedUser.customerOrders.map((order) => (
              <div key={order.id} className='rounded-lg bg-gray-50 p-5 shadow-md'>
                <li className='mb-4'>
                  <p className='mb-2 rounded-lg bg-primary p-2 text-lg text-primary-foreground'>
                    <strong>حالة الطلب:</strong> <span>{order.status}</span>
                  </p>
                  <p className='mb-2 text-lg'>
                    <strong className='text-gray-700'>رقم الطلب:</strong>{' '}
                    <span className='text-gray-900'>{order.id}</span>
                  </p>
                  <p className='mb-2 text-lg'>
                    <strong className='text-gray-700'>التاريخ:</strong>{' '}
                    <span className='text-gray-900'>
                      {format(new Date(order.createdAt), 'yyyy-MM-dd')}
                    </span>
                  </p>
                  <p className='mb-2 text-lg'>
                    <strong className='text-gray-700'>المبلغ:</strong>{' '}
                    <span className='text-gray-900'>{order.amount.toFixed(2)}</span>
                  </p>
                </li>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className='mt-4 flex w-full flex-col items-center gap-2'
                  >
                    <div
                      className='flex w-full items-center justify-between rounded-lg border border-gray-200 bg-secondary p-2 shadow-sm'
                    >
                      <p className='text-lg font-medium text-gray-800'>
                        <strong className='text-gray-700'>المنتج:</strong> {item?.product?.name}
                      </p>
                      <p className='text-lg text-gray-600'>
                        <strong className='text-gray-700'>الكمية:</strong> {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className='mt-6 text-lg text-gray-500'>لا توجد طلبات سابقة</p>
        )}
      </div>
    </div>
  );
}
