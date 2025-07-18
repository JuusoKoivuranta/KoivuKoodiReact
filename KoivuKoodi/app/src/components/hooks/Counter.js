// Counter.js
import React, { useState } from 'react';

const Counter = () => {
  // Declare a state variable named "count" with the initial value of 0
  const [count, setCount] = useState(0);

  // Function to handle incrementing the count
  const increment = () => {
    setCount(count + 1);
  };

  // Function to handle decrementing the count
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Counter</h1>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
