let ID = new Date().getTime();
const getId = () => {
  return `${ID++}`;
}
export default getId;
