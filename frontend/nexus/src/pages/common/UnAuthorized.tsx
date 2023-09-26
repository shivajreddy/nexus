import { useNavigate } from "react-router-dom"

function UnAuthorized() {

  const navigate = useNavigate();

  return (
    <>
      <h1>You are unauthorized to view this Content</h1>
      <button onClick={() => navigate(-1)}> {/* Go back 1 step in history*/}
        Go Back
      </button>
    </>
  )
}

export default UnAuthorized