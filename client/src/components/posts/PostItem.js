import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import { FiThumbsUp, FiThumbsDown, FiMessageSquare } from 'react-icons/fi';

const PostItem = ({
  auth,
  addLike,
  removeLike,
  deletePost,
  showActions,
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1 post-text'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <div className='btn-group'>
              <button
                onClick={() => addLike(_id)}
                type='button'
                className='btn-like'
              >
                <FiThumbsUp />
                <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
              </button>
              <button
                onClick={() => removeLike(_id)}
                type='button'
                className='btn-unlike'
              >
                <FiThumbsDown />
              </button>
              <Link to={`/posts/${_id}`} className='post-discussion-btn'>
                <FiMessageSquare />{' '}
                {comments.length > 0 && (
                  <span className='comment-count'>{comments.length}</span>
                )}
              </Link>
            </div>
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={() => deletePost(_id)}
                type='button'
                className='btn btn-danger'
              >
                <i className='fas fa-times'></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
