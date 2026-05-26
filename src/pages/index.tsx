'use client';
import dynamic from 'next/dynamic';
const CustomerApp = dynamic(() => import('@/components/CustomerApp'), { ssr: false });
export default function CustomerPage() {
  return <CustomerApp />;
}