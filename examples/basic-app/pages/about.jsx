import React from 'react';

function AboutPage() {
  // return React.createElement('div', null, [
  //   React.createElement('h1', null, 'About Page'),
  //   React.createElement('p', null, 'We are learning how Next.js works under the hood!'),
  //   React.createElement('a', { href: '/' }, 'Back Home')
  // ]);
  return (
    <div>
      <h1>About Page</h1>
      <p>We are learning how Next.js works under the hood!</p>
      <a href="/">Back Home</a>
    </div>
  );
}

// Example SSR data
AboutPage.getServerSideProps = () => {
  return { randomNum: Math.floor(Math.random() * 1000) };
};


export default function Wrapper(props) {
  return <AboutPage {...props} />;
}
