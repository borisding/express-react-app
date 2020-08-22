import React, { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import styles from './Home.module.scss';

// fake delay for demo
const delay = (target, ms = 1000) => {
  return new Promise(resolve => setTimeout(() => resolve(target), ms));
};

export default function Home() {
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(result => delay(result.json()))
      .then(users => {
        setIsFetching(false);
        setUsers(users);
      })
      .catch(error => {
        setIsFetching(false);
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Welcome!</h1>
      {isFetching ? (
        <Spinner />
      ) : (
        <p>
          Hello!
          <span className={styles.greetUser}>{users && users[0].name}</span>
        </p>
      )}
    </>
  );
}
