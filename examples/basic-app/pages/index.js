import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Hello from Basic App!</h1>
      <p>This is rendered by our mini Next framework.</p>
      <a href="/about">Go to About</a>
    </div>
  );
}

// Example static props
export async function getStaticProps() {
  return { message: 'Static Hello' };
}
