import styles from "./Login.module.css";
import PageNav from "../Components/PageNav";
import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return; // add some error handling here in future
    login(email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", {
          replace: true,
        }); /*here when we go back like press <-- the app try to go back to login page  and this make like a refresh we don't need so to remove this we must return back to where we started which before the login page like we are here (/) so we logged in so the homepage is before the login page so we return back to it or the app page this is done using replace object*/
      }
    },
    [isAuthenticated, navigate]
  );
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
