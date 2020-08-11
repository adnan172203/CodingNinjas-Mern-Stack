import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import {deleteComment} from '../../actions/post';
import { RiDeleteBackLine } from 'react-icons/ri';

const CommentItem = ({
  comment: { _id, text, name, avatar, user, date },
  postId,
  deleteComment,
  auth
}) => {
  return (
    <>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='comment-color my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
          </p>
          {!auth.loading && user === auth.user._id &&(
              <button type="button" className="comment-delete" onClick={e => deleteComment(postId, _id)}>
                  <RiDeleteBackLine/>
              </button>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToPrps = (state) => {
    return {
        auth: state.auth
    }
};

export default connect(mapStateToPrps,{deleteComment})(CommentItem);
