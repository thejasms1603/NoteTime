import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
      {getInitials(userInfo?.fullName)}
      </div>
      <div className=''>
        <p className=''>{userInfo?.fullName}</p>
        <button onClick={onLogout} className='text-sm text-slate-700 underline'>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
