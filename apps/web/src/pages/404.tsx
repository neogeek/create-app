import { SiteFooter, SiteHeader } from '../components';

import { PageHeader } from 'ui';

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <PageHeader>Whoops. This is not the page you are looking for.</PageHeader>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://media.giphy.com/media/kbUXGJHxS80O1GJwEx/giphy.gif"
        className="m-auto my-10 block"
        alt="Sherlock Holmes with a large magnifying glass looking for something saying where is it?"
      />

      <SiteFooter />
    </>
  );
}
