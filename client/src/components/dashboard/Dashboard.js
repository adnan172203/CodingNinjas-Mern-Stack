import React, { useEffect,Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount} from '../../actions/profile';
import DashboardAction from './DashboardAction';
import Experience from './Experience';
import Education from './Education';
import Spinner from '../layout/Spinner';
import { AiOutlineUser } from "react-icons/ai";

const Dashboard = ({ getCurrentProfile, auth:{user}, profile:{profile,loading},deleteAccount}) => {
 
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? <Spinner />: <Fragment>
      <h1 className="large text-primary">
        Dashboard
      </h1>
      <p className="lead">
        <AiOutlineUser className='dashoutuser'/>welcome {user && user.name}

      </p>
      { profile !== null ? <Fragment>
        <DashboardAction />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />

        <div className="my-2">
          <button className="btn btn-danger" onClick={ () => deleteAccount() }>
            <i className="fas fa-user-minus"></i> Delete My Account
          </button>
        </div>
      </Fragment>:<Fragment>
        <p>you have not yet setup a profile, please add some profile</p>
        <Link to='/create-profile' className='create-btn my-1'> create profile</Link>
      </Fragment> }
     </Fragment> ;
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.profile
  };
};

export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard);
