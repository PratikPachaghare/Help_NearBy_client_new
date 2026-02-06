import React, { useState } from 'react'
import ApiCalls from '../../utils/ApiCalls';
import { Endpoints } from '../../utils/Endpiont';

const dumyData =[
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
]

export default function Home() {
  const [list, setList] = useState(dumyData);

  const handleFinish = async () => {
    const response = ApiCalls('GET',Endpoints?.User?.GetProfile);
    if(response){
      console.log("response",response);
      setList(response);
    }else{
      console.log("error");
    }
  }


  return (
    <div>
      {list.map((item, index) => (
        <div key={index}>{item}</div>
      ))}

      <button >get Data in home page</button>

      <div>
        <p>User NAme</p>
        <p>Address</p>
        <p>Mobile</p>
        <p>contact</p>
      </div>
    </div>
  )
}
