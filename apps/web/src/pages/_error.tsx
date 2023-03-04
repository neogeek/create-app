import { NextPage } from 'next';
import NextErrorComponent from 'next/error';

import React from 'react';

import * as Sentry from '@sentry/nextjs';

interface Props {
  statusCode: number;
}

const CustomErrorComponent: NextPage<Props> = props => {
  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async contextData => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
