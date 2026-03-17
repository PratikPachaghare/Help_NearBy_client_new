import React, { useState } from 'react'

const dumyData =[
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
]

export default function Home() {
  const [list] = useState(dumyData);

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
