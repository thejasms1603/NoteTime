import Navbar from '../../components/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useEffect, useState } from 'react';
import  Modal  from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';

const Home = () => {


  const [ openAddEditModal, setOpenAppEditModal] = useState({
    isShown: false,
    type:"add",
    data:null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Get User Info

  const getUserInfo = async () =>{
    try{
      const response = await axiosInstance.get('/get-user');
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch(error)
    {
      if(error.response.status === 401){
        localStorage.clear();
        navigate('/login')
      }
    }
  };

  useEffect(()=>{
    getUserInfo();
    return ()=>{}
  },[]);


  return (
    <>
      <Navbar userInfo={userInfo}/>

      <div className='container mx-auto'>
        <div className='grid grid-cols-3 mt-8 gap-4'>
          <NoteCard
            title='Meeting on 7th april'
            date='3rd April 2025'
            description='Meeting on 7th april Meeting on 7th april'
            tags='Meeting'
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>

      <button
        className='w-16 h-16 flex justify-center items-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAppEditModal({isShown:true, type:"add", data:null});
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=''
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll'
      >
        <AddEditNotes
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
        onclose={()=>{
          setOpenAppEditModal({isShown:false,type:"add",data:null})}}
         />
      </Modal>
    </>
  );
}

export default Home