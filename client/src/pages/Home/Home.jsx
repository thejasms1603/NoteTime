import Navbar from '../../components/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useState } from 'react';
import  Modal  from 'react-modal';

const Home = () => {


  const [ openAddEditModal, setOpenAppEditModal] = useState({
    isShown: false,
    type:"add",
    data:null,
  });


  return (
    <>
      <Navbar />

      <div className='container mx-auto'>
        <div className='grid grid-cols-3 mt-8 gap-4'>
          <NoteCard
            title='Metting on 7th april'
            date='3rd April 2025'
            description='Metting on 7th april Metting on 7th april'
            tags="Meeting"
            isPinned={true}
            onEdit={()=>{}}
            onDelete={()=>{}}
            onPinNote={()=>{}}
            />
          </div>
      </div>

      <button className='w-16 h-16 flex justify-center items-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={()=>{}}>
        <MdAdd className='text-[32px] text-white' />
      </button>


      <Modal
      isOpen = {openAddEditModal.isShown}
      onRequestClose={()=>{}}
      style={{
        overlay:{
          backgroundColor:"rgba(0,0,0,0.2)",
        },
      }}
      contentLabel=""
      className = ""
      >
      <AddEditNotes/>
      </Modal>
    </>
  );
}

export default Home