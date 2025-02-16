import Hero from '@/Layouts/Heropage';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
  console.log(auth);
  return (
    <>
      <Head title="Welcome" />
      <Hero auth={auth} />
    </>
  );
}
