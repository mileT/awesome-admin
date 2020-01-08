import React from 'react';
import { getUserInfoFromCookie, loginUrl } from '@/utils/utils';

export default class SecurityLayout extends React.Component {
  currentUser = getUserInfoFromCookie();

  render() {
    const { children } = this.props;
    if (!this.currentUser || !this.currentUser.userId) {
      window.location.href = loginUrl();
    }

    return children;
  }
}
