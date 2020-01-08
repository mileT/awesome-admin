export default {
  contract: {
    paidType: {
      pos: {
        val: 0,
        text: 'POS机',
      },
      bank: {
        val: 1,
        text: '银行转账',
      },
      promissory: {
        val: 2,
        text: '本票',
      },
      accumulation: {
        val: 3,
        text: '滚存',
      },
      else: {
        val: 9,
        text: '其它',
      },
    },

    status: {
      waitingForSubmit: {
        val: 0,
        text: '待提交',
      },
      waitingForReview: {
        val: 1,
        text: '待审核',
      },
      released: {
        val: 2,
        text: '已生效',
      },
      else: {
        val: 99,
        text: '其它',
      },
    },
    attachmentType: {
      video: {
        val: 1,
        text: '图像',
      },
      picture: {
        val: 2,
        text: '图片',
      },
    },
  },
  product: {
    status: {
      waitingForSubmit: {
        val: 0,
        text: '待提交',
      },
      waitingForReview: {
        val: 1,
        text: '待审核',
      },
      released: {
        val: 2,
        text: '已发行',
      },
      else: {
        val: 99,
        text: '其它',
      },
    },
  },
}
