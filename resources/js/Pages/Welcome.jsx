import Hero from '@/Layouts/Heropage';
import Footer from '@/Layouts/NewFooter';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ }) {
  return (
    <>
      <Head title="Welcome" />
      <Hero />
      <Footer />
    </>
  );
}
