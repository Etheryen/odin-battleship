function App() {
  const test = document.createElement('h1');
  test.innerHTML = 'TEST';

  return test;
}

document.body.appendChild(App());
