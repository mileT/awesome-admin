import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import { getUserInfoFromCookie, logout } from '@/utils/utils';
import avatar from '@/assets/defaultHeader.png';
import styles from './index.less';

export default class AvatarDropdown extends React.Component {
  currentUser = getUserInfoFromCookie();
  
  onMenuClick = event => {
    const { key } = event;
    if (key === 'logout') {
      logout();
    }
  };

  render() {
    const {
      menu,
    } = this.props;

    if (this.currentUser && !this.currentUser.avatar) {
      this.currentUser.avatar = avatar
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return this.currentUser && this.currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={this.currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{this.currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}
