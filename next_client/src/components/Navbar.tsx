import Link from 'next/link'
import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',height:'80px',backgroundColor:"gray",padding:'0 40px'}}>
            <h2>Welcome Next App</h2>
            <div style={{display:'flex', gap:'20px'}}>
                <Link href="/">Home</Link>
                <Link href="/autors">Autors</Link>
                <Link href="/add">Add</Link>
            </div>
        </div>
    )
}

export default Navbar