'use server';

import db from 'lib/prisma';

async function convertCoordinates() {
  const orders = await db.order.findMany({
    select: { id: true, latitude: true, longitude: true }
  });

  console.log('Orders fetched:', orders);

  // for (const order of orders) {
  //   const updateData: { latitude?: number | null; longitude?: number | null } = {};

  //   if (typeof order.latitude === 'string') {
  //     updateData.latitude = parseFloat(order.latitude);
  //   }

  //   if (typeof order.longitude === 'string') {
  //     updateData.longitude = parseFloat(order.longitude);
  //   }

  //   if (Object.keys(updateData).length > 0) {
  //     await db.order.update({
  //       where: { id: order.id },
  //       data: updateData
  //     });
  //   }
  // }
}

export default convertCoordinates;
