import React from 'react'
import {Map, Marker} from 'pigeon-maps'

export default function Home() {
  return (
    <div className='text-center'>
      <h1 className="text-4xl font-bold mt-5">QRoute</h1>

      <div className="mt-5 mx-20 rounded-xl">
        <Map height={500} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
          <Marker width={50} anchor={[50.879, 4.6997]} />
        </Map>
      </div>
    </div>
  )
}
