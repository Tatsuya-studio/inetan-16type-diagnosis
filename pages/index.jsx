import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/diagnosis');
  }, []);

  return null; // ローディングUI不要ならnullでOK
}
