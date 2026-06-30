// StarPad shared utilities
const DAY = 86400000;

export function formatPrice(cents, showSymbol = true) {
  if (cents == null || Number.isNaN(Number(cents))) return showSymbol ? '¥0.00' : '0.00';
  const yuan = (Number(cents) / 100).toFixed(2);
  return showSymbol ? '¥' + yuan : yuan;
}

export function formatCount(num) {
  if (num == null) return '0';
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return String(num);
}

export function formatTime(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d)) return '';
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return y + '-' + m + '-' + day;
}

export function formatStatus(status) {
  const map = { unpaid:'待付款', paid:'待发货', shipped:'待收货', done:'已完成', refunding:'退款中', refunded:'已退款', closed:'已关闭' };
  return map[status] || status || '未知状态';
}

export function formatExpireDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d)) return '';
  const diffDays = Math.ceil((d.getTime() - Date.now()) / DAY);
  if (diffDays <= 0) return '已到期';
  if (diffDays <= 7) return diffDays + '天后到期';
  return formatTime(d);
}
