'use client';
import dynamic from 'next/dynamic';
const SellerApp = dynamic(() => import('@/components/SellerApp'), { ssr: false });
export default function SellerPage() {
  return <SellerApp />;
}