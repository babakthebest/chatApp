import Image from 'next/image'
import { db } from './../lib/db';
import Button  from '@/components/ui/Button';

export default async function Home() {
  // await  db.set("helo","helo")
  return (
    <Button>Hello</Button>
  )
}
