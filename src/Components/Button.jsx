import styles from "./Button.module.css";

function Button({ children, onClickk, type }) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClickk}>
      {children}
    </button>
  );
}

export default Button;
