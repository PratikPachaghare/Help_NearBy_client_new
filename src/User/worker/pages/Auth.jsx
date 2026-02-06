import React, { useState } from 'react';
import './Auth.css';
import UserLogin from '../componets/Auth/Login/UserLogin';
import UserRegister from '../componets/Auth/Register/UserRegister';
import WorkerLogin from '../componets/Auth/Login/workerLogin';
import WorkerRegister from '../componets/Auth/Register/workerRegister';

const Auth = () => {
  const [isUser, setIsUser] = useState(true); // true = User, false = Worker
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={isUser ? 'active' : ''}
          onClick={() => setIsUser(true)}
        >
          User
        </button>
        <button
          className={!isUser ? 'active' : ''}
          onClick={() => setIsUser(false)}
        >
          Worker
        </button>
      </div>

      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'} as {isUser ? 'User' : 'Worker'}</h2>
        
        {isUser ? (
          isLogin ? <UserLogin /> : <UserRegister />
        ) : (
          isLogin ? <WorkerLogin /> : <WorkerRegister />
        )}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
