import Image from 'next/image'
import { db } from './../lib/db';

export default async function Home() {
  await  db.set("helo","helo")
  return (
    <div>hello</div>
  )
}
