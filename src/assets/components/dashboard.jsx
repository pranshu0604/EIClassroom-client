import { SubjectCard } from "./SubjectCard"
import { useState, useEffect } from "react"
import axios from 'axios';
import Navbar from "./auth/navbar";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  )
}

const Error = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center h-screen bg-black text-white text-2xl ">
      <div>{error}</div>
      <div>
        <button 
        onClick={() => {
          localStorage.clear();
          navigate("/signin")
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded my-5"
        >Re-Login</button>
      </div>
    </div>
  )
}
const Dashboard = () => {
  const [create, setCreate] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/subjects/subjects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setSubjects(response.data);
      } catch (err) {
        setError("Failed to fetch subjects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error error={error}/>;
  }

  return (
    <div className="bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] min-h-screen h-full pb-20 poppins">
      {create && <CreateSubject create={create} setCreate={setCreate} />}
      <Navbar/>
      <div className=" text-5xl flex justify-center items-center poppins-semibold pt-28 pb-3 dark:text-white">
        Subjects
      </div>
      <div className="px-10 py-4 flex justify-center items-center">
        <div className="text-xl poppins-regular mr-2 dark:text-white">Add new Subjects:</div>
        <button
          onClick={() => setCreate(!create)}
          className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 poppins-regular rounded"
        >
          Create Subject
        </button>
      </div>

      <div className="grid justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.code}
              name={subject.name}
              code={subject.code}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CreateSubject = ({create, setCreate}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`http://localhost:8080/api/subjects/newsubject`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
        }
      });

      console.log('Subject created:', response.data);
      setSuccess("Subject added Successfully")
      setTimeout(() => {
        
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'Failed to create subject. Please try again.');
    }
  };

  return (
    <div className="absolute h-full w-full flex items-center justify-center z-10 poppins-regular backdrop-brightness-50">
      <form className="max-w-md mx-auto bg-white dark:bg-black rounded-xl p-2 w-1/3 h-auto" onSubmit={handleSubmit}>
        <div className="p-4">
          <div 
            className="flex justify-end text-white cursor-pointer"
            onClick={() => setCreate(false)}
          >❌</div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="subject_name"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="subject_name"
              className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Subject Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="code"
              id="subject_code"
              className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={formData.code}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="subject_code"
              className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Subject Code
            </label>
          </div>
          {error && <div className="text-red-500 mb-3">{error}</div>}
          {success && <div className="text-green-500 mb-3">{success}</div>}
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 mt-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard