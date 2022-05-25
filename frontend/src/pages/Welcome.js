import React from 'react';
import { ParseEmail } from '../services/nameParser.js';

function Welcome({email}) {

  const fullName = ParseEmail(email);

  return (
    <div>Welcome {fullName}</div>
  )
}

export default Welcome;