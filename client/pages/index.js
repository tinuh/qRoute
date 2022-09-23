import React, {useState} from 'react'
import {Map, Marker} from 'pigeon-maps'
import { stamenToner } from 'pigeon-maps/providers'

export default function Home() {
  const [address, setAddress] = useState('')

  const [paths, setPaths] = useState([
    {color: "#c92e39", anchors: [
      {
        address: "Montgomery Blair HS",
        coords: [39.018, -77.012]
      },
      {
        address: "Marilyn J. Praisner Community Library",
        coords: [39.102 ,-76.940]
      }
    ]},
  ]);

  const updateAddress = (e) => {
    setAddress(e.target.value);
  }

  const add = () => {
    setPaths(prev => {
      console.log(prev);
      prev[0].anchors.push({
        address: address,
        coords: [39.102 ,-76.940]
      })
      setAddress('');
      return prev
    })
  }

  return (
    <div className='text-center mx-20'>
      <h1 className="text-4xl font-bold mt-5">QRoute</h1>

      <div className="my-5 relative">
        <label className="sr-only" htmlFor="name">Address</label>
        <input value = {address} onChange = {updateAddress} className="w-full py-4 pl-3 pr-16 text-sm border-2 border-black rounded-lg" placeholder="Address" type="text" id="address" />

        <button className="absolute p-2 text-white bg-black rounded-full -translate-y-1/2 top-1/2 right-4" type="button" onClick = {add}>
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <ul className="text-left">
        {paths.map(({color, anchors}) => (
          anchors.map((point, key) => 
            <li key = {key}>{point.address}</li>
          )
        ))}
      </ul>

      <div className="mt-5">
        <Map className="rounded-2xl" height={500} defaultCenter={[39.018, -77.012]} defaultZoom={11}>
          {paths.map(({color, anchors}) => (
            anchors.map((point) => (
              <Marker width={40} anchor={point.coords} color = {color}/>
            ))
          ))}
        </Map>
      </div>
    </div>
  )
}
