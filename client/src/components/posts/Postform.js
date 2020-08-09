import React, { useState } from 'react';
import { connect } from 'react-redux';
import {addPost} from '../../actions/post';

const Postform = ({ addPost }) => {
  const [text, setText] = useState('');

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='post-form my-1'
        onSubmit={e => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='100'
          rows='2'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' className='post-btn my-1' value='Submit' />
      </form>
    </div>
  );
};

export default connect(null, { addPost })(Postform);
