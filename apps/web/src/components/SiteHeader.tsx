import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="py-20 text-center">
      <h1 className="text-center text-7xl font-bold text-gray-900">
        <Link href="/" className="no-underline">
          @neogeek/create-app
        </Link>
      </h1>
      <p className="mt-8 text-3xl">
        A <b className="highlight">full-stack</b>,{' '}
        <b className="highlight">typesafe</b> app built with{' '}
        <a href="https://nextjs.org/">Next.js</a>,{' '}
        <a href="https://www.typescriptlang.org/">TypeScript</a>,{' '}
        <a href="https://trpc.io/">tRPC</a>, <a href="https://zod.dev/">zod</a>,{' '}
        <a href="https://www.prisma.io/">Prisma</a> and more.
      </p>
    </header>
  );
}
