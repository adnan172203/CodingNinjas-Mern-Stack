import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div>
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='landing-inner'>
            <h1 className='x-large'>Code<span className='layout-headline'>Ninja</span> the Developer's Network</h1>
            <p className='lead'>
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            <div className='buttons'>
              <Link to='/register' className='btn front-btn'>
                Sign Up
              </Link>
              <Link to='/login' className='btn btn-light'>
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

export default connect(mapStateToProps)(Landing);
