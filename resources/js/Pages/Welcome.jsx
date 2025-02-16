import Hero from '@/Layouts/Heropage';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
  return (
    <>
      <Head title="Welcome" />
      <Hero auth={auth} />
    </>
  );
}
