import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  })

  const [message, setMessage] = useState('')

  const handleInput = (e) => {
    const name = e.target.name
    const value = e.target.value

    setFormData((prevData) => {
      return { ...prevData, [name]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/api/v1/predict", formData, { withCredentials: false });
      
      setMessage(response?.data?.message);
      console.log(response);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'An error occurred');
    }
  }

  // const handleSubmit = async (e) => {

  //   e.preventDefault()

  //   try {
  //     const response = await axios.post("http://localhost:3000/api/v1/predict", {formData}, {withCredentials: false})
      
  //     setMessage(response?.data?.message)
  //     console.log(response)
  //   } catch (err) {
  //     console.error(err)
  //     setMessage(err?.response?.data?.message)
  //   }
  // }
  console.log(formData)

  return (
    <>
      <h1 >{message}</h1>
      <form onSubmit={ (e) => handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <h3>Crop Prediction</h3>
        <div className="form-field">
          <input type="text" id="temperature" name="temperature" placeholder="Temperature" onChange={handleInput}/>
        </div>
        <div className="form-field">
          <input type="text" id="humidity" name="humidity" placeholder="Humidity" onChange={handleInput}/>
        </div>
        <div className="form-field">
          <input type="text" id="ph" name="ph" placeholder="Soil PH" onChange={handleInput}/>
        </div>
        <div className="form-field">
          <input type="text" id="rainfall" name="rainfall" placeholder="Rain Fall" onChange={handleInput}/>
        </div>
        <div className="form-field">
          <button type="submit">Predict</button>
        </div>
      </form>
    </>
  )
}

export default App
