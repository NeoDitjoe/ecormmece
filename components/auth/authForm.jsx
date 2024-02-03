import { useRef, useState } from 'react';
import style from './authForm.module.css'
import GoogleButton from 'react-google-button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import StateContext from '@/lib/context';
import LoadingBackdrop from '../backdrop/loading';

export default function AuthForm() {

  const [login, setLogin] = useState(false)
  const { setOpen } = StateContext()

  const router = useRouter()

  const activeBackdrop = router.pathname === '/auth'

  const usernameRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()

  async function signUpHandler(e) {
    e.preventDefault()
    const username = usernameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value

    console.log(username, email, password)
    try {
      await createUser(username, email, password)
      console.log('success')
    } catch (error) {
      console.log(error)
    }
  }

  async function SignInHandler(e) {
    e.preventDefault()
    const email = emailRef.current.value
    const password = passwordRef.current.value

    try{
      setOpen(true)
      await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });
      setOpen(false)
    }catch(error){
      setOpen(false)
      console.log(error)
    }
  }

  return (
    <div className={style.section}>
      <div className={style.formDiv}>
        <form className={style.form} onSubmit={login ? SignInHandler : signUpHandler}>
        <h2>{login ? 'Sign In' : 'Sign Up'}</h2>
          {login ? '' : <div>
            <label htmlFor="username">Username: </label>
            <input type='text' ref={usernameRef} placeholder='username' required />
          </div>}

          <div>
            <label htmlFor="email">Email:</label>
            <input type='email' ref={emailRef} placeholder='email' required />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input type='password' id='email' ref={passwordRef} placeholder='password' required />
          </div>

          <div>
            <button type='submit'>
              submit
            </button>
          </div>

          <p 
            onClick={() => setLogin(!login)} 
            className={style.account}
          >{login ? 'Create an account' : 'Have an account ?'}</p>

          <hr />

          {/* <GoogleButton
            onClick={() => signIn('google')}
          /> */}
        </form>
      </div>

      {activeBackdrop ? <div className={style.background}>

      </div> : ''}

      <LoadingBackdrop />
    </div>
  );
}

async function createUser(username, email, password) {
  const response = await fetch('/api/auth/createUser', {
    method: 'POST',
    body: JSON.stringify({ username: username, email: email, password: password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}