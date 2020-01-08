import React, { PureComponent } from 'react';
import { toThousands } from '@/utils/utils';
import styles from '../style.less';

class Receipt extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className={`${styles.print}`} >
        <div style={{
          fontSize: 20, position: 'absolute', left: '10mm', top: '10mm' }}>
          <span>购信托产品</span>
          <span>1元/份</span>
          <span>{data.amount * 10000}份</span>
          <span>¥{toThousands(data.amount * 10000)}</span>
        </div>
        <div style={{
          fontSize: 20, position: 'absolute', left: '10mm', top: '20mm' }}>
          <span>购信托产品</span>
          <span>1元/份</span>
          <span>{data.amount * 10000}份</span>
          <span>¥{toThousands(data.amount * 10000)}</span>
        </div>
      </div>
    );
  }
}

export default Receipt;
