import React, { useState } from 'react'

export default function Login() {
  const [data,setData] = useState({name:'',email: '', password: ''});

  const handleFinish = () => {
    const responce = apiCallsTest('POST', '/test-endpoint', data, { extraParam: 'value' });
    
    console.log('Test API Response:', responce);
  }
  return (
    <div>
      Login page
    </div>
  )
}
