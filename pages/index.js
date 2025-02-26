import Head from 'next/head'

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Head>
        <title>Hello World - Next.js</title>
        <meta name="description" content="My first Next.js app" />
      </Head>

      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Hello World!
      </h1>
      <p style={{ fontSize: '1.5rem' }}>
        My first Next.js app deployed on Vercel
      </p>
    </div>
  )
}