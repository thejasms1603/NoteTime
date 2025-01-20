import { useState } from "react";
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({noteData, type, onclose}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription]= useState("");
  const [ tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async()=>{

  }
  // Edit Note
  const editNote = async () =>{

  }

  const handleAddNote = () =>{
    if(!title){
      setError("Please enter the title");
      return;
    }
    if(!description){
      setError("Please enter the description")
      return;
    }
    setError("")

    if(type === 'edit'){
      editNote()
    } else{
      addNewNote()
    }
  }
  return (
    <div className="relative">

      <button
      className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
      onClick={onclose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go the gym at 5'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>DESCRIPTION</label>
        <textarea
          type='text'
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Description'
          rows={10}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
      </div>

      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput 
        tags={tags}
        setTags={setTags}
        />
      </div>

      {error &&<p className="text-red-500 text-xs pt-4">{error}</p>}
       <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
        ADD
      </button>
    </div>
  );
}

export default AddEditNotes