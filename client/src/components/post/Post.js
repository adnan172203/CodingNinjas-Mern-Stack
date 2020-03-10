import React, { useEffect, Fragment } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/post';

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);

  return (
    <div>
      {loading || post === null ? (
        <Spinner />
      ) : (
        <Fragment>
            <Link to="/posts" className="btn">Back to posts</Link>
          <PostItem post={post} showActions={false} />
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    post: state.post
  };
};

export default connect(mapStateToProps, { getPost })(Post);
