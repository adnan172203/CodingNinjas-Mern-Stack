import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import { getPosts } from '../../actions/post';
import Postform from './Postform';

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      
      <Postform />

      <div className='posts'>
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>

    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    post: state.post
  };
};

export default connect(mapStateToProps, { getPosts })(Posts);
