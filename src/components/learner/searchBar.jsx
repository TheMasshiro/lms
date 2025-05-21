import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');
  const [isFocused, setIsFocused] = useState(false);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/student/courses/' + input);
    }
  };

  return (
    <form 
      onSubmit={onSearchHandler} 
      className={`max-w-xl w-full flex items-center bg-white rounded-lg shadow-sm transition duration-200 ${
        isFocused ? 'ring-2 ring-blue-400 border-transparent' : 'border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-center pl-4">
        <FaSearch className="w-5 h-5 text-gray-400" />
      </div>
      
      <input 
        onChange={(e) => setInput(e.target.value)} 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input}
        type='text' 
        placeholder='Search courses...' 
        className='w-full py-3 px-3 outline-none text-gray-700 placeholder-gray-400'
      />
      
      {input && (
        <button
          type="button"
          onClick={() => setInput('')}
          className="p-2 hover:bg-gray-100 rounded-full mr-1"
        >
          <FaTimes className="w-4 h-4 text-gray-400" />
        </button>
      )}
      
      <button 
        type='submit' 
        className='bg-blue-600 hover:bg-blue-700 rounded-r-lg text-white px-6 py-3 font-medium transition-colors duration-200'
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;