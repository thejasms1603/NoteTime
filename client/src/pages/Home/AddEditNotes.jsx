import { useState } from "react";
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosinstance";

const AddEditNotes = ({
  showToastMessage,
  noteData,
  type,
  onClose,
  getAllNotes,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [description, setDescription] = useState(noteData?.description || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        description,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.data.response.message);
      }
    }
  };
  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        description,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.data.response.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!description) {
      setError("Please enter the description");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className='relative'>
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500'
        onClick={onClose}
      >
        <MdClose className='text-xl text-slate-400' />
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
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
      <button
        className='btn-primary font-medium mt-5 p-3'
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE " : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes