const TIME_OUT = 5000;
const TEXT = 'Loading failure. Try again later.';

export const showMsgError = () => {
  const msg = document.createElement('div');
  msg.classList.add('msg__container');
  msg.classList.add('msg__text');
  msg.textContent = TEXT;

  document.body.append(msg);
  setTimeout(() => {
    msg.remove();
  }, TIME_OUT);
};
