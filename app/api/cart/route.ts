import { NextResponse } from 'next/server';
import { getCart } from '@/app/(e-comm)/cart/actions/cartServerActions';

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
} 